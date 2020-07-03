'use strict'
const util = require('../util');
const validator = require('../validator');

function Game(attributes) {

    if (typeof attributes === 'undefined')
        return null;

    if (!validator.validateAs(attributes, 'Game'))
        return null;

    const id = util.generateId('game', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Game;
