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
        getType: _ => typeName,
        toJson
    });
}

module.exports = Game;
