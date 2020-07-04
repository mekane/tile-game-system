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

    const id = attributes.id || util.generateId('encounter', attributes.name);

    const {name, description} = attributes;


    function toJson() {
        return {
            id,
            name,
            description,
            board: attributes.board,
            units: attributes.units
        }
    }

    return Object.freeze({
        getId: _ => id,
        getType: _ => typeName,
        toJson
    });
}

module.exports = Encounter;
