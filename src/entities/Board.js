'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Board';

function Board(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('board', attributes.name);
    const name = attributes.name;
    const tiles = attributes.tiles.slice();
    const terrain = attributes.terrain;

    function toJson() {
        return {
            id,
            name,
            tiles,
            terrain
        }
    }

    return Object.freeze({
        getId: _ => id,
        getType: _ => typeName,
        toJson
    });
}

module.exports = Board;
