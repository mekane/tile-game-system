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

    function getState() {
        return state;
    }

    function intializeStateForEncounter(currentEncounter) {
        const boardDefinition = currentEncounter.getBoard().toJson();

        return Object.freeze({
            board: boardDefinition
        });
    }

    function sendAction(message) {
        if (!validator.validateAs(message, 'GameAction'))
            throw new Error('Invalid action');

        switch (message.action.toLowerCase()) {
            case 'addunit':
                if (!message.unitId)
                    throw new Error('Add Unit failed: missing unit id');

                const encounter = scenario.getEncounter(currentEncounterIndex);
                const unitDefs = encounter.getUnitsById();

                const unitDefinition = unitDefs[message.unitId];
                if (typeof unitDefinition !== 'object')
                    throw new Error(`Add Unit failed: could not find unit with id ${message.unitId}`);

                if (typeof message.boardX === 'undefined' || typeof message.boardY === 'undefined')
                    throw new Error('Add Unit failed: missing board coordinates');

                const {boardX, boardY} = message;
                const {width, height} = encounter.getBoard().getDimensions();

                if (boardX < 0 || boardX > width || boardY < 0 || boardY > height)
                    throw new Error('Add Unit failed: board coordinates out of bounds');

                //TODO: actual implementation
                break;
            case 'startencounter':
                startEncounter(message);
        }
    }

    function startEncounter({encounterIndex}) {
        if (typeof encounterIndex !== 'number')
            throw new Error('Start Encounter failed: missing encounter index');

        const maxEncounterIndex = scenario.getNumberOfEncounters();
        if (encounterIndex < 0 || encounterIndex > maxEncounterIndex)
            throw new Error('Start Encounter failed: invalid encounter index');

        currentEncounterIndex = encounterIndex;
        const encounter = scenario.getEncounter(encounterIndex);
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
