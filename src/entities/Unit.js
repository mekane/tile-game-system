'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Unit';

function Unit(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('unit', attributes.name);
    const {name, movement} = attributes;

    function toJson() {
        return {
            id,
            name,
            movement
        }
    }

    return Object.freeze({
        getId: _ => id,
        getName: _ => name,
        getType: _ => typeName,
        toJson
    });
}

module.exports = Unit;
