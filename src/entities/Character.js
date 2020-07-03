'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Character';

function Character(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = util.generateId('character', attributes.name);

    return Object.freeze({
        getId: _ => id,
        getType: _ => typeName
    });
}

module.exports = Character;
