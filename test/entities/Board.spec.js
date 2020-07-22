'use strict'
const expect = require('chai').expect;
const validBoard = require('../_fixtures').validBoard;
const validator = require('../../src/validator');

const Board = require('../../src/entities/Board');

describe('The Board entity', () => {
    it(`exports a constructor function`, () => {
        expect(Board).to.be.a('function');
    });

    it(`expects an object of attributes, and returns null if not`, () => {
        expect(Board()).to.be.a('null');
        expect(Board(false)).to.be.a('null');
        expect(Board(0)).to.be.a('null');
        expect(Board('test')).to.be.a('null');
        expect(Board(['test'])).to.be.a('null');
    });

    it(`expects the object to conform to the BoardAttributes schema and returns null if not`, () => {
        expect(Board({})).to.be.a('null');
        expect(Board({test: 'test'})).to.be.a('null');

        const badBoardNoTiles = {
            name: 'Bad Board No Tiles',
            terrain: {}
        }
        expect(Board(badBoardNoTiles)).to.be.a('null');

        const badBoardNoTilesArrays = {
            name: 'Bad Board No Items in Tiles',
            tiles: [],
            terrain: {}
        }
        expect(Board(badBoardNoTilesArrays)).to.be.a('null');

        const badBoardNoTilesSubArrays = {
            name: 'Bad Board No Items in Tiles Arrays',
            tiles: [
                [],
                [],
                []
            ],
            terrain: {}
        }
        expect(Board(badBoardNoTilesSubArrays)).to.be.a('null');

        const badBoardBadContentInSubArrays = {
            name: 'Bad Board Non-string Items in Tiles Arrays',
            tiles: [
                [1],
                [{}],
                [false]
            ],
            terrain: {}
        }
        expect(Board(badBoardBadContentInSubArrays)).to.be.a('null');
    });

    it(`returns a Board object if the attributes are valid`, () => {
        expect(Board(validBoard())).to.be.an('object');
    });

    it(`returns an immutable object`, () => {
        const newBoard = Board(validBoard());
        expect(_ => newBoard.name = 'Test Mutation').to.throw(/Cannot add property/);
    });

    const validBoardId = /^board_test_\d{6,8}/;

    it(`has an automatically generated ID`, () => {
        const newBoard = Board(validBoard());
        const newId = newBoard.getId();
        expect(newId).to.be.a('string');
        const expectedMessage = `Expected ${newId} to match regex ${validBoardId}`;
        const matchedRegex = validBoardId.test(newId)
        expect(matchedRegex, expectedMessage).to.equal(true);
    });

    it(`does not generate an id if one is present in the attributes`, () => {
        const idString = 'Existing ID';
        const boardAttributes = validBoard();
        boardAttributes.id = idString;
        const newBoard = Board(boardAttributes);

        expect(newBoard.getId()).to.equal(idString);
    });

    it(`has a getDimensions method that returns the size of the board`, () => {
        const newBoard = Board(validBoard());
        expect(newBoard.getDimensions()).to.deep.equal({width: 3, height: 3});
    });

    it(`finds the widest row for the width for getDimensions`, () => {
        const boardData = {
            name: 'Test',
            tiles: [
                ['A', 'A'],
                ['A', 'A', 'A', 'A', 'A', 'A', 'A'],
                ['A', 'A', 'A'],
                ['A', 'A']
            ],
            terrain: {A: {name: 'Grass'}}
        }
        const newBoard = Board(boardData);
        expect(newBoard.getDimensions()).to.deep.equal({width: 7, height: 4});
    });

    it(`has a getTerrainAt method that returns the terrain definition at a given x,y coordinate`, () => {
        const newBoard = Board(validBoard());
        expect(newBoard.getTerrainAt({x: 0, y: 0})).to.deep.equal({
            name: 'Grass',
            movementRequired: 1,
            blocksMovement: false
        });
        expect(newBoard.getTerrainAt({x: 2, y: 1})).to.deep.equal({
            name: 'Trees',
            movementRequired: 1,
            blocksMovement: false
        });
        expect(newBoard.getTerrainAt({x: 0, y: 1})).to.deep.equal({
            name: 'Hills',
            movementRequired: 2,
            blocksMovement: false
        });
        expect(newBoard.getTerrainAt({x: 0, y: 2})).to.deep.equal({
            name: 'Stones',
            movementRequired: 1,
            blocksMovement: true
        });
    });

    it(`returns empty for unknown tiles`, () => {
        const expected = {empty: true};
        const newBoard = Board(validBoard());
        expect(newBoard.getTerrainAt({x: -1, y: 0})).to.deep.equal(expected);
        expect(newBoard.getTerrainAt({x: 0, y: -1})).to.deep.equal(expected);
        expect(newBoard.getTerrainAt({x: -1, y: -1})).to.deep.equal(expected);
        expect(newBoard.getTerrainAt({x: 99, y: 99})).to.deep.equal(expected);
    });

    it(`has a getTileAt method that returns tile definitions at a given x,y coordinate`, () => {
        const newBoard = Board(validBoard());
        expect(newBoard.getTileAt({x: 0, y: 0})).to.equal('A');
        expect(newBoard.getTileAt({x: 1, y: 0})).to.equal('A');
        expect(newBoard.getTileAt({x: 2, y: 1})).to.equal('B');
        expect(newBoard.getTileAt({x: 0, y: 1})).to.equal('C');
        expect(newBoard.getTileAt({x: 0, y: 2})).to.equal('D');
    });

    it(`returns null for invalid tile coordinates`, () => {
        const newBoard = Board(validBoard());
        expect(newBoard.getTileAt({x: -1, y: 0})).to.be.a('null');
        expect(newBoard.getTileAt({x: -1, y: -1})).to.be.a('null');
        expect(newBoard.getTileAt({x: 0, y: 99})).to.be.a('null');
        expect(newBoard.getTileAt({x: 99, y: 0})).to.be.a('null');
    });

    it(`has a getType function that returns the name of the entity type`, () => {
        const newBoard = Board(validBoard());
        expect(newBoard.getType()).to.equal('Board');
    });

    it(`has a getViewData function that returns JSON data suitable for a view`, () => {
        let boardData = {
            name: 'Test',
            tiles: [
                ['A', 'A'],
                ['A', 'B'],
                ['A', 'C'],
                ['A', 'A']
            ],
            terrain: {
                A: {name: 'Grass'},
                B: {name: 'Rocks', movementRequired: 2},
                C: {name: 'Walls', blocksMovement: true}
            }
        }
        let newBoard = Board(boardData);

        const grass = {name: 'Grass', movementRequired: 1, blocksMovement: false};
        const rocks = {name: 'Rocks', movementRequired: 2, blocksMovement: false};
        const walls = {name: 'Walls', movementRequired: 1, blocksMovement: true};
        const expectedViewData = [
            [grass, grass],
            [grass, rocks],
            [grass, walls],
            [grass, grass]
        ];

        expect(newBoard.getViewData()).to.deep.equal(expectedViewData);
    });

    it(`fills in undefined tiles or spaces ('' or " ") with empty spaces`, () => {
        const boardData = {
            name: 'Test',
            tiles: [
                [, 'A', 'A'],
                ['A', 'A', 'A', 'A', 'A'],
                ['', 'A', 'A'],
                [' ', 'A', 'A']
            ],
            terrain: {A: {name: 'Grass'}}
        }
        const newBoard = Board(boardData);

        const grass = {name: 'Grass', movementRequired: 1, blocksMovement: false};
        const empty = {empty: true};

        const expectedViewData = [
            [empty, grass, grass, empty, empty],
            [grass, grass, grass, grass, grass],
            [empty, grass, grass, empty, empty],
            [empty, grass, grass, empty, empty]
        ];

        const actualData = newBoard.getViewData();
        expect(actualData).to.deep.equal(expectedViewData);
    });

    it(`has a toJson method that returns the raw data for the Board`, () => {
        const newBoard = Board(validBoard());
        expect(validator.validateAs(newBoard.toJson(), newBoard.getType())).to.equal(true);
    });

    it(`returns copies from toJson, not original objects`, () => {
        const originalBoardData = validBoard();
        originalBoardData.id = 'board_test_1234';

        const newBoard = Board(originalBoardData);
        const json = newBoard.toJson();
        expect(json).to.not.equal(originalBoardData);
        expect(json.tiles, 'Tiles JSON').to.not.equal(originalBoardData.tiles);
        expect(json.terrain, 'Terrain JSON').to.not.equal(originalBoardData.terrain);
    });
});
