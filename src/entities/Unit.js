'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Unit';

function Unit(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = util.generateId('unit', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Unit;
