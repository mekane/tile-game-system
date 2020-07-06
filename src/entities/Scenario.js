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
    const encounters = attributes.encounters.map(Encounter);

    function toJson() {
        return {
            id,
            name,
            encounters: encounters.map(e => e.toJson())
        }
    }

    return Object.freeze({
        getEncounter: index => encounters[index],
        getId: _ => id,
        getType: _ => typeName,
        toJson
    });
}

module.exports = Scenario;
