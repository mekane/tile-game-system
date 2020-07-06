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
        toJson
    });
}

function intializeStateFrom(scenario, encounterIndex = 0) {
    const boardDefinition = scenario.getEncounter(encounterIndex).getBoard().toJson();
    const unitsById = scenario.getEncounter(encounterIndex).getUnitsById()

    return {
        board: boardDefinition,
        unitsById
    };
}

module.exports = Game;
