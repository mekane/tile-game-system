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

    const state = intializeStateFrom(scenario, attributes.currentEncounter || 0);

    function getState() {
        return state; //TODO: test for immutability and freeze or stringify/parse
    }

    function sendAction(message) {
        if (!validator.validateAs(message, 'GameAction'))
            throw new Error('Invalid action');

        switch (message.action.toLowerCase()) {
            case 'addunit':
                if (!message.unitId)
                    throw new Error('Add Unit failed: missing unit id');

                //TODO: this needs to be unit definitions from the encounter
                const unitDef = state.unitsById[message.unitId];
                if (typeof unitDef !== 'object')
                    throw new Error(`Add Unit failed: could not find unit with id ${message.unitId}`);

                if (typeof message.boardX === 'undefined' || typeof message.boardY === 'undefined')
                    throw new Error('Add Unit failed: missing board coordinates');

                const {boardX, boardY} = message;
                //const {boardWidth, boardHeight} = state.board.getDimensions();
                /*TODO: replace with above getDim() */
                const boardWidth = 99;
                /*TODO*/
                const boardHeight = 99;

                if (boardX < 0 || boardX > boardWidth || boardY < 0 || boardY > boardHeight)
                    throw new Error('Add Unit failed: board coordinates out of bounds');

                break;
        }
    }

    function toJson() {
        return {
            id,
            name,
            scenario: scenario.toJson()
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

function intializeStateFrom(scenario, encounterIndex = 0) {
    const boardDefinition = scenario.getEncounter(encounterIndex).getBoard().toJson();
    const unitDefinitions = scenario.getEncounter(encounterIndex).getUnitsById()

    return {
        board: boardDefinition,
        unitsById: unitDefinitions
    };
}

module.exports = Game;
