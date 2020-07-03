'use strict'
const expect = require('chai').expect;
const validBoard = require('../_fixtures').validBoard;

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

    it(`has a getType function that returns the name of the entity type`, () => {
        const newBoard = Board(validBoard());
        expect(newBoard.getType()).to.equal('Board');
    });

});


