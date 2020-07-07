'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Board';

/**
 * This entity holds the definition of a Map or Board for a single encounter
 * It is meant to be used as a read-only reference for the layout and terrain
 * of a map, not as a live object to hold state.
 *
 * The map editor should load the JSON of the Board entity and return it (including ID)
 * when modifications are made, which will update the entire entity and save
 * it to storage.
 *
 * Methods on this entity are convenience methods for retrieving information about
 * the terrain and tile layout.
 */
function Board(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('board', attributes.name);
    const name = attributes.name;
    const tiles = attributes.tiles.slice();
    const terrain = JSON.parse(JSON.stringify(attributes.terrain));

    function getDimensions() {
        const rows = tiles.length;
        const cols = tiles[0].length;
        const width = cols;
        const height = rows;
        return {width, height};
    }

    function toJson() {
        return {
            id,
            name,
            tiles,
            terrain
        }
    }

    return Object.freeze({
        getDimensions,
        getId: _ => id,
        getType: _ => typeName,
        toJson
    });
}

module.exports = Board;
