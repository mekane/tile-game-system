'use strict'
const util = require('../util');
const validator = require('../validator');

const Encounter = require('./Encounter');

const typeName = 'Scenario';

function Scenario(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('scenario', attributes.name);
    const name = attributes.name;
    const encounter = Encounter(attributes.encounter);

    function toJson() {
        return {
            id,
            name,
            encounter: encounter.toJson()
        }
    }

    return Object.freeze({
        getEncounter: _ => encounter,
        getId: _ => id,
        getType: _ => typeName,
        toJson
    });
}

module.exports = Scenario;
