'use strict'
const expect = require('chai').expect;
const {validBoard} = require('../../_fixtures.js');
const Board = require('../../../engine/entities/Board.js');

describe('The line of sight method on the Board class', () => {
    it('returns an empty array for bad arguments', () => {
        const board = Board(validBoard())
        expect(board.lineOfSightFor()).to.deep.equal([]);
        expect(board.lineOfSightFor(false)).to.deep.equal([]);
        expect(board.lineOfSightFor('foo')).to.deep.equal([]);
        expect(board.lineOfSightFor({})).to.deep.equal([]);
    })

    it('returns a result array of the same dimensions as the Board', () => {
        const board3x3 = Board(validBoard());
        const actual3x3 = board3x3.lineOfSightFor(unitInstance());
        expect(actual3x3.length).to.equal(3);
        expect(actual3x3[0].length).to.equal(3);
        expect(actual3x3[1].length).to.equal(3);
        expect(actual3x3[2].length).to.equal(3);

        const board2x4 = makeBoard(makeFloorTiles(4, 2));
        const actual2x4 = board2x4.lineOfSightFor(unitInstance());
        expect(actual2x4.length).to.equal(2);
        expect(actual2x4[0].length).to.equal(4);
        expect(actual2x4[1].length).to.equal(4);
    })
})

describe('Tracing line of sight for a unit', () => {
    it(`can always see its own square`, () => {
        const board = makeBoard(makeFloorTiles(1, 1));
        const expected = [[true]];
        expect(board.lineOfSightFor(unitInstance())).to.deep.equal(expected);
    })

    it(`can see down a single open square in one direction`, () => {
        const boardNorth = makeBoard(makeFloorTiles(1, 2));
        const unitNorth = unitInstance();
        unitNorth.positionY = 1;
        expect(boardNorth.lineOfSightFor(unitNorth), 'One North').to.deep.equal([[true], [true]]);

        const boardEast = makeBoard(makeFloorTiles(2, 1));
        expect(boardEast.lineOfSightFor(unitInstance()), 'One East').to.deep.equal([[true, true]]);

        const boardSouth = makeBoard(makeFloorTiles(1, 2));
        expect(boardSouth.lineOfSightFor(unitInstance()), 'One South').to.deep.equal([[true], [true]]);

        const boardWest = makeBoard(makeFloorTiles(2, 1));
        const unitWest = unitInstance();
        unitWest.positionX = 1;
        expect(boardWest.lineOfSightFor(unitWest), 'One West').to.deep.equal([[true, true]]);
    })

    it(`can see down a single "hallway" in one direction`, () => {
        const boardNorth = makeBoard(makeFloorTiles(1, 4));
        const unitNorth = unitInstance();
        unitNorth.positionY = 3;
        const expectedNorth = [[true], [true], [true], [true]];
        expect(boardNorth.lineOfSightFor(unitNorth), 'Three North').to.deep.equal(expectedNorth);

        const boardEast = makeBoard(makeFloorTiles(4, 1));
        const expectedEast = [[true, true, true, true]];
        expect(boardEast.lineOfSightFor(unitInstance()), 'Three East').to.deep.equal(expectedEast);

        const boardSouth = makeBoard(makeFloorTiles(1, 4));
        const expectedSouth = [[true], [true], [true], [true]];
        expect(boardSouth.lineOfSightFor(unitInstance()), 'Three South').to.deep.equal(expectedSouth);

        const boardWest = makeBoard(makeFloorTiles(4, 1));
        const unitWest = unitInstance();
        unitWest.positionX = 3;
        const expectedWest = [[true, true, true, true]];
        expect(boardWest.lineOfSightFor(unitWest), 'Three West').to.deep.equal(expectedWest);
    })

    it(`can see all of an open 3x3 room (can see diagonally)`, () => {
        const board3x3 = makeBoard(makeFloorTiles(3, 3));
        const unitCentered = unitInstance();
        unitCentered.positionX = 1;
        unitCentered.positionY = 1;
        const expected = [
            [true, true, true],
            [true, true, true],
            [true, true, true]
        ];
        //reminder that these raw result coordinates (e.g. [0][2]) are in [y][x] form (row,column)
        const result = board3x3.lineOfSightFor(unitCentered);
        expect(result[0][2], 'Can see NE').to.equal(true);
        expect(result[2][2], 'Can see SE').to.equal(true);
        expect(result[2][0], 'Can see SW').to.equal(true);
        expect(result[0][0], 'Can see NW').to.equal(true);
        expect(result, 'Can see All').to.deep.equal(expected);
    })

    it(`is blocked by walls in direct path`, () => {
        const tilesNorth = makeFloorTiles(1, 4);
        tilesNorth[1][0] = 'W';
        const boardNorth = makeBoard(tilesNorth);
        const unitNorth = unitInstance();
        unitNorth.positionY = 3;
        const expectedNorth = [[false], [false], [true], [true]];
        expect(boardNorth.lineOfSightFor(unitNorth), 'Wall North').to.deep.equal(expectedNorth);

        const tilesEast = makeFloorTiles(4, 1);
        tilesEast[0][2] = 'W';
        const boardEast = makeBoard(tilesEast);
        const expectedEast = [[true, true, false, false]];
        expect(boardEast.lineOfSightFor(unitInstance()), 'Wall East').to.deep.equal(expectedEast);

        const tilesSouth = makeFloorTiles(1, 4);
        tilesSouth[2][0] = 'W';
        const boardSouth = makeBoard(tilesSouth);
        const expectedSouth = [[true], [true], [false], [false]];
        expect(boardSouth.lineOfSightFor(unitInstance()), 'Wall South').to.deep.equal(expectedSouth);

        const tilesWest = makeFloorTiles(4, 1);
        tilesWest[0][1] = 'W';
        const boardWest = makeBoard(tilesWest);
        const unitWest = unitInstance();
        unitWest.positionX = 3;
        const expectedWest = [[false, false, true, true]];
        expect(boardWest.lineOfSightFor(unitWest), 'Wall West').to.deep.equal(expectedWest);
    })

    it(`is not blocked by a single wall tangential to diagonal path`, () => {
        let tiles = [
            ['F', 'F', 'F'],
            ['W', 'F', 'W'],
            ['F', 'F', 'F']
        ];
        const board = makeBoard(tiles);
        const unitCentered = unitInstance();
        unitCentered.positionX = 1;
        unitCentered.positionY = 1;

        const expected = [
            [true, true, true],
            [false, true, false],
            [true, true, true]
        ];
        expect(board.lineOfSightFor(unitCentered), 'Walls East and South').to.deep.equal(expected);
    });

    it(`is blocked by two walls in diagonal path`, () => {
        let tiles = [
            ['F', 'W', 'F'],
            ['W', 'F', 'W'],
            ['F', 'W', 'F']
        ];
        const board = makeBoard(tiles);
        const unitCentered = unitInstance();
        unitCentered.positionX = 1;
        unitCentered.positionY = 1;

        const expected = [
            [false, false, false],
            [false, true, false],
            [false, false, false]
        ];
        expect(board.lineOfSightFor(unitCentered), 'Walls block diagonals').to.deep.equal(expected);
    })

    it(`can see all of an open 5x5 room (secondary diagonals)`, () => {
        const board5x5 = makeBoard(makeFloorTiles(5, 5));
        const unitCentered = unitInstance();
        unitCentered.positionX = 2;
        unitCentered.positionY = 2;
        const expected = [
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, true, true, true]
        ];
        //reminder that these raw result coordinates (e.g. [0][2]) are in [y][x] form (row,column)
        const result = board5x5.lineOfSightFor(unitCentered);
        expect(result, 'Can see All').to.deep.equal(expected);
        expect(result[0][3], 'Can see NNE').to.equal(true);
        expect(result[1][4], 'Can see ENE').to.equal(true);
        expect(result[3][4], 'Can see ESE').to.equal(true);
        expect(result[4][3], 'Can see SSE').to.equal(true);
        expect(result[4][1], 'Can see SSW').to.equal(true);
        expect(result[3][0], 'Can see WSW').to.equal(true);
        expect(result[1][0], 'Can see WNW').to.equal(true);
        expect(result[0][1], 'Can see NNW').to.equal(true);
    });

    //take a list of directions to ignore

    //more interesting cases
})

//TODO: might be nice to have a (static) Game function to "stamp out" an instance from a definition
function unitInstance({x, y} = {x: 0, y: 0}) {
    return {
        definitionId: 'unit_id_123',
        movementMax: 6,
        movementRemaining: 6,
        name: 'Name',
        positionX: x,
        positionY: y,
        turnOrder: 1
    }
}

function makeFloorTiles(width, height) {
    const result = [];
    for (let h = 0; h < height; h++) {
        result.push(Array(width).fill('F'))
    }
    return result;
}

function makeBoard(tiles) {
    const boardData = validBoard();
    if (tiles)
        boardData.tiles = tiles;
    return Board(boardData)
}
