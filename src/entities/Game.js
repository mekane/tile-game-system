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
    let state = attributes.state || intializeStateForEncounter(scenario.getEncounter(currentEncounterIndex));

    function getCurrentEncounter() {
        return scenario.getEncounter(currentEncounterIndex);
    }

    function getState() {
        return state;
    }

    function intializeStateForEncounter(currentEncounter) {
        const boardDefinition = currentEncounter.getBoard().toJson();

        const newState = {
            units: []
        };

        return Object.freeze(newState);
    }

    function sendAction(message) {
        if (!validator.validateAs(message, 'GameAction'))
            throw new Error('Invalid action');

        switch (message.action.toLowerCase()) {
            case 'addunit':
                addUnit(message);
                break;
            case 'moveunit':
                moveUnit(message);
                break;
            case 'startencounter':
                startEncounter(message);
        }
    }

    function addUnit({unitId, boardX, boardY}) {
        if (!unitId)
            throw new Error('Add Unit failed: missing unit id');

        const encounter = getCurrentEncounter();
        const unitDefs = encounter.getUnitsById();

        const unitDefinition = unitDefs[unitId];
        if (typeof unitDefinition !== 'object')
            throw new Error(`Add Unit failed: could not find unit with id ${unitId}`);

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

        const newUnit = {
            definitionId: unitDefinition.getId(),
            movementMax: unitDefinition.getMovement(),
            movementRemaining: unitDefinition.getMovement(),
            name: unitDefinition.getName(),
            positionX: boardX,
            positionY: boardY,
        };
        state.units.push(newUnit);
    }

    function moveUnit({unitIndex, direction}) {
        if (typeof unitIndex !== 'number')
            throw new Error('Move Unit failed: missing unit index');

        if (typeof direction !== 'string')
            throw new Error('Move Unit failed: missing direction');

        const unitToMove = state.units[unitIndex];
        if (typeof unitToMove !== 'object')
            throw new Error(`Move Unit failed: could not find unit with index ${unitIndex}`);

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

        unitToMove.movementRemaining -= terrainDef.movementRequired;
        unitToMove.positionX = x;
        unitToMove.positionY = y;
    }

    //TODO: make this its own use case
    function startEncounter({encounterIndex}) {
        if (typeof encounterIndex !== 'number')
            throw new Error('Start Encounter failed: missing encounter index');

        const maxEncounterIndex = scenario.getNumberOfEncounters();
        if (encounterIndex < 0 || encounterIndex > maxEncounterIndex)
            throw new Error('Start Encounter failed: invalid encounter index');

        currentEncounterIndex = encounterIndex;
        const encounter = getCurrentEncounter();
        state = intializeStateForEncounter(encounter);
    }

    function toJson() {
        return {
            id,
            name,
            scenario: scenario.toJson(),
            currentEncounterIndex
            //TODO add: currentState: state
        }
    }

    return Object.freeze({
        getId: _ => id,
        getScenario: _ => scenario,
        getState,
        getType: _ => typeName,
        sendAction,
        toJson
    });
}

module.exports = Game;
