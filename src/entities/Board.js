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
 *
 * Note on Board coordinates: the data structure is set up to prioritize the appearance
 * in the literal definition over code adherence to (x,y) style coordinates.
 * So a 2 row x 3 column board that would display like this:
 *
 * @---+---+---+
 * | A | A | B |
 * +---+---+---+
 * | A | A | A |
 * +---+---+---+
 *
 * const tiles = [
 *   ['A', 'A', 'B'],
 *   ['A', 'A', 'A']
 * ]
 *
 * So that the visual appearance of the data matches the layout of the board. But note that
 * accessing tiles[0][2] would return the third tile in the first row (the 'B'), not the tile
 * at x=0, y=2 (which is invalid). So accesses to the underlying data structure are done as
 * row, column (which is basically (y,x).
 *
 * Methods that take an x and a y will put these in the right order so you can think of the
 * x,y origin as the top-left corner (the @ symbol above)
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

    function getTileAt({x, y}) {
        console.log(`get tile (${x},${y})`)
        if (x < 0 || y < 0)
            return null;

        const {width, height} = getDimensions();
        if (x >= width || y >= height)
            return null;

        return tiles[y][x];
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
        getTileAt,
        getType: _ => typeName,
        toJson
    });
}

module.exports = Board;
