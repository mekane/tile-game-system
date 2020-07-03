'use strict'
const util = require('../util');
const validator = require('../validator');

function Character(attributes) {

    if (!validator.validateAs(attributes, 'Character'))
        return null;

    const id = util.generateId('character', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Character;
