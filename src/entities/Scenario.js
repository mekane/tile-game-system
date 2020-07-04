'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Scenario';

function Scenario(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('scenario', attributes.name);
    const name = attributes.name;

    function toJson() {
        return {
            id,
            name,
            encounter: attributes.encounter
        }
    }

    return Object.freeze({
        getId: _ => id,
        getType: _ => typeName,
        toJson
    });
}

module.exports = Scenario;
