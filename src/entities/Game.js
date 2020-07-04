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


    const state = {
        board: scenario.getEncounter().getBoard().toJson(),
        unitsById: scenario.getEncounter().getUnitsById()
    };

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

module.exports = Game;
