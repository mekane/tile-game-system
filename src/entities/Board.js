'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Board';

function Board(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = util.generateId('board', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Board;
