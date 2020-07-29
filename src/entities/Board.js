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

const terrainDefaults = Object.freeze({
    name: 'Unknown',
    movementRequired: 1,
    blocksMovement: false
});
const empty = {empty: true};

function Board(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('board', attributes.name);
    const name = attributes.name;
    const tiles = attributes.tiles.slice();
    const terrain = JSON.parse(JSON.stringify(attributes.terrain));

    function getDimensions() {
        const numberOfRows = tiles.length;

        let numberOfColumns = -1;
        tiles.forEach(row => {
            if (row.length > numberOfColumns)
                numberOfColumns = row.length;
        });

        const width = numberOfColumns;
        const height = numberOfRows;

        return {width, height};
    }

    function getTerrainAt({x, y}) {
        const terrainType = getTileAt({x, y});

        if (typeof terrainType === 'string' && terrainType !== '' && terrainType !== ' ') {
            const terrainProperties = terrain[terrainType];
            return Object.assign({}, terrainDefaults, terrainProperties);
        }

        return empty;
    }

    function getTileAt({x, y}) {
        if (x < 0 || y < 0)
            return null;

        if (y >= tiles.length)
            return null;

        if (x >= tiles[y].length)
            return null;

        const tileValue = tiles[y][x];
        if (tileValue === '' || tileValue === ' ')
            return null;

        return tileValue;
    }

    function getViewData() {
        const {width, height} = getDimensions();

        const tileData = [];
        for (let y = 0; y < height; y++) {
            let nextRow = [];
            for (let x = 0; x < width; x++) {
                nextRow.push(getTerrainAt({x, y}));
            }
            tileData.push(nextRow);
        }

        return tileData;
    }

    function lineOfSightFor(unit) {
        if (typeof unit !== 'object' || typeof unit.positionX !== 'number' || typeof unit.positionY !== 'number')
            return [];

        const {width, height} = getDimensions();

        const result = [];
        for (let h = 0; h < height; h++) {
            result.push(Array(width).fill(false))
        }

        const unitTile = {x: unit.positionX, y: unit.positionY};
        result[unitTile.y][unitTile.x] = true;

        //check north
        let current = {x: unitTile.x, y: unitTile.y - 1};
        let currentTile = getTileAt(current);
        while (currentTile !== null && !currentTile.empty) {
            result[current.y][current.x] = true;
            current.y--;
            currentTile = getTileAt(current);
        }

        //check east
        current = {x: unitTile.x + 1, y: unitTile.y};
        currentTile = getTileAt(current);
        while (currentTile !== null && !currentTile.empty) {
            result[current.y][current.x] = true;
            current.x++;
            currentTile = getTileAt(current)
        }

        //check south
        current = {x: unitTile.x, y: unitTile.y + 1};
        currentTile = getTileAt(current);
        while (currentTile !== null && !currentTile.empty) {
            result[current.y][current.x] = true;
            current.y++;
            currentTile = getTileAt(current)
        }

        //check west
        current = {x: unitTile.x - 1, y: unitTile.y};
        currentTile = getTileAt(current);
        while (currentTile !== null && !currentTile.empty) {
            result[current.y][current.x] = true;
            current.x--;
            currentTile = getTileAt(current);
        }

        return result;
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
        getTerrainAt,
        getTileAt,
        getType: _ => typeName,
        getViewData,
        lineOfSightFor,
        toJson
    });
}

module.exports = Board;
