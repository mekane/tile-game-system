'use strict'
const util = require('../util.js');
const validator = require('../validator.js');

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
 * Would be defined like this:
 *
 * const tiles = [
 *   ['A', 'A', 'B'],
 *   ['A', 'A', 'A']
 * ]
 *
 * So that the visual appearance of the data matches the layout of the board. But note that
 * accessing tiles[0][2] would return the third tile in the first row (the 'B'), not the tile
 * at x=0, y=2 (which is invalid). So accesses to the underlying data structure are done as
 * row, column (which is basically (y,x)).
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

const secondaryDiagonals = ['nne', 'ene', 'ese', 'sse', 'ssw', 'wsw', 'wnw', 'nnw'];

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

    function getInterTileWalls() {
        const wallData = [];

        for (let r = 0; r < tiles.length; r++) {
            const row = tiles[r];

            const dataRow = [];
            for (let c = 0; c < row.length; c++) {
                const thisTile = getTerrainAt({y: r, x: c})
                const tileToRight = getTerrainAt({y: r, x: c + 1})
                const tileBelow = getTerrainAt({y: r + 1, x: c})

                const wallData = {r: 0, b: 0}

                console.log(thisTile)

                if (tileToRight.blocksEdges && thisTile.id !== tileToRight.id)
                    wallData.r = 1

                if (tileBelow.blocksEdges && thisTile.id !== tileBelow.id)
                    wallData.b = 1

                dataRow.push(wallData)
            }

            wallData.push(dataRow)
        }

        return wallData;
    }

    function getTerrainAt({x, y}) {
        const terrainType = getTileAt({x, y});

        if (typeof terrainType === 'string' && terrainType !== '' && terrainType !== ' ') {
            const terrainProperties = terrain[terrainType];
            return Object.assign({id: terrainType}, terrainDefaults, terrainProperties);
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

        //util.DIRECTIONS.forEach(dir => lineOfSightSearch(unitTile, dir));

        //TODO: only do these if it makes sense (we know we can see something in that direction)
        //secondaryDiagonals.forEach(dir => extendedLineOfSightSearch(unitTile, dir));

        return result;

        function lineOfSightSearch({x, y}, direction) {
            let current = util.adjustCoordinatesForDirection(x, y, direction);
            //let currentTerrain = getTerrainAt(current);
            //console.log(`Search ${direction} from (${x},${y}): ${blocked ? '[blocked]' : 'visible'}`)
            while (!blocked(getTerrainAt(current))) {
                result[current.y][current.x] = true;

                if (isDiagonal(direction)) {
                    const [side1, side2] = getCoordinatesForDiagonal(current.x, current.y, direction);
                    //console.log(`checking (${current.x}, ${current.y})`, side1, side2);
                    if (blocked(getTerrainAt(side1)) && blocked(getTerrainAt(side2)))
                        result[current.y][current.x] = false;
                }

                current = util.adjustCoordinatesForDirection(current.x, current.y, direction);
                //blocked = currentTerrain.empty || currentTerrain.blocksMovement;
                //console.log(`Search ${direction} from (${current.x},${current.y}): ${blocked ? '[blocked]' : 'visible'}`)
            }
        }

        function extendedLineOfSightSearch({x, y}, direction) {
            let distance = 1;

            let nextAdjust = util.secondaryDirectionCoordinates(direction, distance);
            let current = {x: x + nextAdjust.x, y: y + nextAdjust.y};

            while (!blocked(getTerrainAt(current))) {
                result[current.y][current.x] = true;

                distance++;
                nextAdjust = util.secondaryDirectionCoordinates(direction, distance);
                current = {x: x + nextAdjust.x, y: y + nextAdjust.y};
            }
        }
    }

    function blocked(terrain) {
        return terrain === null || terrain.empty || terrain.blocksMovement;
    }

    function isDiagonal(direction) {
        return direction.length > 1;
    }

    function getCoordinatesForDiagonal(x, y, direction) {
        const adjustForDir = util.directionAdjustmentsByDirection[direction];
        const xRev = adjustForDir.x * -1;
        const yRev = adjustForDir.y * -1;

        return [{x, y: y + yRev}, {x: x + xRev, y}]
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
        getInterTileWalls,
        getTerrainAt,
        getTileAt,
        getType: _ => typeName,
        getViewData,
        lineOfSightFor,
        toJson
    });
}

module.exports = Board;
