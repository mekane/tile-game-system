'use strict'
const expect = require('chai').expect;
const validGame = require('../_fixtures').validGame;

const Game = require('../../src/entities/Game');

describe('The Game entity', () => {
    it(`exports a constructor function`, () => {
        expect(Game).to.be.a('function');
    });

    it(`expects an object of attributes, and returns null if not`, () => {
        expect(Game()).to.be.a('null');
        expect(Game(false)).to.be.a('null');
        expect(Game(0)).to.be.a('null');
        expect(Game('test')).to.be.a('null');
        expect(Game(['test'])).to.be.a('null');
    });

    it(`expects the object to conform to the GameAttributes schema and returns null if not`, () => {
        expect(Game({})).to.be.a('null');
        expect(Game({test: 'test'})).to.be.a('null');

        const badGameBadContentInSubArrays = {
            name: 'Bad Game Non-string Items in Tiles Arrays',
            tiles: [
                [1],
                [{}],
                [false]
            ],
            terrain: {}
        }
        expect(Game(badGameBadContentInSubArrays)).to.be.a('null');
    });

    it(`returns a Game object if the attributes are valid`, () => {
        expect(Game(validGame())).to.be.an('object');
    });

    it(`returns an immutable object`, () => {
        const newGame = Game(validGame());
        expect(_ => newGame.name = 'Test Mutation').to.throw(/Cannot add property/);
    });

    const validGameId = /^game_test_\d{6,8}/;

    it(`has an automatically generated ID`, () => {
        const newGame = Game(validGame());
        const newId = newGame.getId();
        expect(newId).to.be.a('string');
        const expectedMessage = `Expected ${newId} to match regex ${validGameId}`;
        const matchedRegex = validGameId.test(newId)
        expect(matchedRegex, expectedMessage).to.equal(true);
    });
});
