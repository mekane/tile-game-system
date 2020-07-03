'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Encounter';

/**
 * An Encounter is a single level or map or battle.
 * It is initialized with
 */
function Encounter(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = util.generateId('encounter', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Encounter;
