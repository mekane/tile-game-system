'use strict'
const util = require('../util');
const validator = require('../validator');

const Scenario = require('./Scenario');

const typeName = 'Game';

function Game(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('game', attributes.name);

    const scenario = Scenario(attributes.scenario);

    return Object.freeze({
        getId: _ => id,
        getType: _ => typeName,
        getScenario: _ => scenario
    });
}

module.exports = Game;
