'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Game';

function Game(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = util.generateId('game', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Game;
