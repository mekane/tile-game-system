'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Unit';

function Unit(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('unit', attributes.name);
    const {name, movement, turnOrder} = attributes;

    function toJson() {
        return {
            id,
            name,
            movement,
            turnOrder
        }
    }

    return Object.freeze({
        getId: () => id,
        getMovement: () => movement,
        getName: () => name,
        getTurnOrder: () => turnOrder,
        getType: () => typeName,
        toJson
    });
}

module.exports = Unit;
