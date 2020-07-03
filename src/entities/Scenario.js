'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Scenario';

function Scenario(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = util.generateId('scenario', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Scenario;
