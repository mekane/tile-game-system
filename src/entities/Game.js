'use strict'
const util = require('../util');
const validator = require('../validator');

const Scenario = require('./Scenario');

const typeName = 'Game';

function Game(attributes) {
    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('game', attributes.name);
    const name = attributes.name;
    const scenario = Scenario(attributes.scenario);

    let currentEncounterIndex = attributes.currentEncounterIndex || 0;

    let state = attributes.currentState || initializeStateForEncounter(scenario.getEncounter(currentEncounterIndex));

    function getCurrentEncounter() {
        return scenario.getEncounter(currentEncounterIndex);
    }

    function getState() {
        return state;
    }

    function initializeStateForEncounter(currentEncounter) {

        const newState = {
            units: [],
            unitsGroupedByTurnOrder: [],
            activeGroup: null,
            activeUnit: null
        };

        return newState;
    }

    function sendAction(message) {
        if (!validator.validateAs(message, 'GameAction'))
            throw new Error('Invalid action');

        switch (message.action.toLowerCase()) {
            case 'activateunit':
                activateUnit(message);
                break;
            case 'addunit':
                addUnit(message);
                break;
            case 'doneactivating':
                doneActivating(message);
                break;
            case 'moveunit':
                moveUnit(message);
                break;
        }
    }

    function activateUnit({unitIndex}) {
        if (typeof unitIndex !== 'number')
            throw new Error('missing unit index');

        const unitToActivate = state.units[unitIndex];
        if (typeof unitToActivate !== 'object')
            throw new Error(`could not find unit with index ${unitIndex}`);

        const currentActivationGroup = state.unitsGroupedByTurnOrder[state.activeGroup];
        if (currentActivationGroup.indexOf(unitIndex) < 0)
            throw new Error(`unit at index ${unitIndex} cannot activate now`);

        if (unitToActivate.doneActivating)
            throw new Error(`unit at index ${unitIndex} is already done`);

        const currentActiveUnit = state.units[state.activeUnit];
        if (currentActiveUnit && currentActiveUnit.hasActivated)
            currentActiveUnit.doneActivating = true;

        state.activeUnit = unitIndex;
    }

    function addUnit({unitId, unitName, boardX, boardY}) {
        if (!unitId && !unitName)
            throw new Error('Add Unit failed: missing unit id or name');

        const encounter = getCurrentEncounter();
        const unitDefs = encounter.getUnitsById();

        let unitDefinition = false;

        if (unitId)
            unitDefinition = unitDefs[unitId];
        else {
            const keys = Object.keys(unitDefs);
            for (let i = 0; i < keys.length; i++) {
                const unitDef = unitDefs[keys[i]];
                if (unitDef.getName() === unitName) {
                    unitDefinition = unitDef;
                    break;
                }
            }
        }

        if (typeof unitDefinition !== 'object') {
            if (unitId)
                throw new Error(`Add Unit failed: could not find unit with id ${unitId}`);
            else
                throw new Error(`Add Unit failed: could not find unit with name ${unitName}`);
        }

        if (typeof boardX === 'undefined' || typeof boardY === 'undefined')
            throw new Error('Add Unit failed: missing board coordinates');

        const {width, height} = encounter.getBoard().getDimensions();

        if (boardX < 0 || boardX > width || boardY < 0 || boardY > height)
            throw new Error('Add Unit failed: board coordinates out of bounds');

        const terrainDef = encounter.getBoard().getTerrainAt({x: boardX, y: boardY});
        if (terrainDef.blocksMovement)
            throw new Error('Add Unit failed: cannot add unit at specified coordinates');

        state.units.forEach(u => {
            if (u.positionX === boardX && u.positionY === boardY)
                throw new Error('Add Unit failed: cannot add unit at specified coordinates');
        });

        const unitTurnOrder = unitDefinition.getTurnOrder();

        const newUnit = {
            definitionId: unitDefinition.getId(),
            movementMax: unitDefinition.getMovement(),
            movementRemaining: unitDefinition.getMovement(),
            name: unitDefinition.getName(),
            positionX: boardX,
            positionY: boardY,
            turnOrder: typeof unitTurnOrder === 'number' ? unitTurnOrder : 99
        };
        state.units.push(newUnit);
        state.unitsGroupedByTurnOrder = groupUnitsByTurnOrder(state.units);

        if (state.activeGroup === null) {
            state.activeGroup = 0;
            state.activeUnit = 0;
        }
    }

    function groupUnitsByTurnOrder(originalUnits) {
        const units = originalUnits.slice();
        const turnOrderMap = {};

        units.forEach((unit, index) => {
            if (typeof turnOrderMap[unit.turnOrder] === 'undefined') {
                turnOrderMap[unit.turnOrder] = [];
            }
            turnOrderMap[unit.turnOrder].push(index);
        });
        const keys = Object.keys(turnOrderMap);
        return keys.map(key => turnOrderMap[key]);
    }

    function doneActivating({unitIndex}) {
        if (typeof unitIndex !== 'number')
            throw new Error('missing unit index');

        const unitToMark = state.units[unitIndex];
        if (typeof unitToMark !== 'object')
            throw new Error(`could not find unit with index ${unitIndex}`);

        if (unitToMark.doneActivating)
            throw new Error(`unit at index ${unitIndex} is already done`);

        unitToMark.hasActivated = true;
        unitToMark.doneActivating = true;
        const currentGroup = state.unitsGroupedByTurnOrder[state.activeGroup];

        state.activeUnit = findNextUnitInGroup(currentGroup);

        if (typeof state.activeUnit === 'undefined') {
            state.activeGroup++;
            const nextGroup = state.unitsGroupedByTurnOrder[state.activeGroup];

            if (nextGroup)
                state.activeUnit = nextGroup[0];
            else {
                state.unitsGroupedByTurnOrder = groupUnitsByTurnOrder(state.units);
                state.activeGroup = 0;
                state.activeUnit = state.unitsGroupedByTurnOrder[0][0];
                state.units.forEach(u => {
                    u.hasActivated = false;
                    u.doneActivating = false;
                    u.movementRemaining = u.movementMax;
                });
            }
        }


        function findNextUnitInGroup(group) {
            for (let i = 0; i < group.length; i++) {
                const unitIndex = group[i];
                const unit = state.units[unitIndex];
                if (!unit.doneActivating)
                    return unitIndex;
            }
        }
    }

    function moveUnit({unitIndex, direction}) {
        if (typeof unitIndex !== 'number')
            throw new Error('Move Unit failed: missing unit index');

        if (typeof direction !== 'string')
            throw new Error('Move Unit failed: missing direction');

        const unitToMove = state.units[unitIndex];
        if (typeof unitToMove !== 'object')
            throw new Error(`Move Unit failed: could not find unit with index ${unitIndex}`);

        if (unitToMove.doneActivating)
            throw new Error(`Move Unit failed: unit is already done activating`);

        const unitX = unitToMove.positionX;
        const unitY = unitToMove.positionY;
        const encounter = getCurrentEncounter();
        const {x, y} = util.adjustCoordinatesForDirection(unitX, unitY, direction);
        const tile = encounter.getBoard().getTileAt({x, y});

        if (tile === null)
            throw new Error('Move Unit failed: destination is out of bounds');

        state.units.forEach(unit => {
            if (unit.positionX === x && unit.positionY === y)
                throw new Error('Move Unit failed: destination is occupied');
        });

        const terrainDef = encounter.getBoard().getTerrainAt({x, y});

        if (terrainDef.blocksMovement)
            throw new Error('Move Unit failed: destination is blocked');

        if (unitToMove.movementRemaining < terrainDef.movementRequired)
            throw new Error('Move Unit failed: unit lacks sufficient movement points');

        unitToMove.hasActivated = true;
        unitToMove.movementRemaining -= terrainDef.movementRequired;
        unitToMove.positionX = x;
        unitToMove.positionY = y;
    }

    function startEncounter(encounterIndex) {
        if (typeof encounterIndex !== 'number')
            throw new Error('missing encounter number');

        const maxEncounterIndex = scenario.getNumberOfEncounters();
        if (encounterIndex < 0 || encounterIndex > maxEncounterIndex)
            throw new Error('invalid encounter number');

        currentEncounterIndex = encounterIndex;
        const encounter = getCurrentEncounter();
        state = initializeStateForEncounter(encounter);

        encounter.getInit().forEach(sendAction);

        if (state.units.length) {
            state.activeGroup = 0;
            state.activeUnit = state.unitsGroupedByTurnOrder[0][0];
        }
    }

    function toJson() {
        return {
            id,
            name,
            scenario: scenario.toJson(),
            currentEncounterIndex,
            currentState: state
        }
    }

    return Object.freeze({
        getId: _ => id,
        getCurrentBoard: () => getCurrentEncounter().getBoard(),
        getScenario: () => scenario,
        getState,
        getType: () => typeName,
        sendAction,
        startEncounter,
        toJson
    });
}

module.exports = Game;
