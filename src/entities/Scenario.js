'use strict'
const util = require('../util');
const validator = require('../validator');

function Scenario(attributes) {

    if (!validator.validateAs(attributes, 'Scenario'))
        return null;

    const id = util.generateId('scenario', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Scenario;
