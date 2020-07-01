'use strict'
const Validator = require('jsonschema').Validator;
const attributesSchema = require('../schema/CharacterAttributes.schema.json');
const schemaValidator = new Validator();


function Character(attributes) {

    if (typeof attributes === 'undefined')
        return null;

    const result = schemaValidator.validate(attributes, attributesSchema);
    if (result.errors[0]) {
        console.error('Invalid attributes: ' + result.errors[0].stack);
        return null;
    }

    return {};
}

module.exports = Character;
