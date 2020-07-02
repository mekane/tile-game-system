'use strict'
const Validator = require('jsonschema').Validator;
const attributesSchema = require('../schema/BoardAttributes.schema.json');
const schemaValidator = new Validator();

const util = require('../util');

function Board(attributes) {

    if (typeof attributes === 'undefined')
        return null;

    const result = schemaValidator.validate(attributes, attributesSchema);
    if (result.errors[0]) {
        //console.error('Invalid attributes: ' + result.errors[0].stack);
        return null;
    }

    const id = util.generateId('board', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Board;
