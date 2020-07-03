'use strict'
const util = require('../util');
const validator = require('../validator');

function Unit(attributes) {

    if (!validator.validateAs(attributes, 'Unit'))
        return null;

    const id = util.generateId('unit', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Unit;
