'use strict'
const util = require('../util');
const validator = require('../validator');

function Board(attributes) {

    if (typeof attributes === 'undefined')
        return null;

    if (!validator.validateAs(attributes, 'Board'))
        return null;

    const id = util.generateId('board', attributes.name);

    return Object.freeze({
        getId: _ => id
    });
}

module.exports = Board;
