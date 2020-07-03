'use strict'
const util = require('../util');
const validator = require('../validator');

/**
 * An Encounter is a single level or map or battle.
 * It is initialized with
 */
function Encounter(attributes) {

    if (typeof attributes === 'undefined')
        return null;

    if (!validator.validateAs(attributes, 'Encounter'))
        return null;

    const id = util.generateId('encounter', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Encounter;
