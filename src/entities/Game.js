'use strict'
const util = require('../util');
const validator = require('../validator');

const Scenario = require('./Scenario');

const activateUnit = require('./gameActions/activateUnit.js');
const addUnit = require('./gameActions/addUnit.js');

const doneActivating = require('./currentUnitActions/doneActivating.js');

const typeName = 'Game';

function Game(attributes) {
    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('game', attributes.name);
    const name = attributes.name;
    const scenario = Scenario(attributes.scenario);

    let currentEncounterIndex = attributes.currentEncounterIndex || 0;

    let state = attributes.currentState || initializeStateForEncounter(scenario.getEncounter(currentEncounterIndex));

    function getActiveUnit() {
        const activeUnit = state.units[state.activeUnit];
        return Object.assign({}, activeUnit);
    }

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
                activateUnit(state, message);
                break;
            case 'addunit':
                addUnit(state, message, getCurrentEncounter());
                break;
            case 'doneactivating':
                doneActivating(state, message);
                break;
            case 'moveunit':
                moveUnit(message);
                break;
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
        getActiveUnit,
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
