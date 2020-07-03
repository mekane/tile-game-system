'use strict'
const Validator = require('jsonschema').Validator;
const attributesSchema = require('../schema/EncounterAttributes.schema.json');
const unitSchema = require('../schema/UnitAttributes.schema.json');
const schemaValidator = new Validator();
schemaValidator.addSchema(unitSchema, "http://martykane.org/schemas/UnitAttributes.schema.json");

const util = require('../util');

/**
 * An Encounter is a single level or map or battle.
 * It is initialized with
 */
function Encounter(attributes) {

    if (typeof attributes === 'undefined')
        return null;

    const result = schemaValidator.validate(attributes, attributesSchema);
    if (result.errors[0]) {
        console.error('Invalid attributes: ' + result.errors[0].stack);
        return null;
    }

    const id = util.generateId('encounter', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Encounter;
