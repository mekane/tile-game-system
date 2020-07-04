'use strict'
const expect = require('chai').expect;
const validGame = require('../_fixtures').validGame;
const validator = require('../../src/validator');

const Game = require('../../src/entities/Game');
const validGameId = /^game_test_\d{6,8}/;

describe('Game Entity Construction', () => {
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

    it(`can re-create itself from the output of its toJson method`, () => {
        const originalGameData = validGameDataWithIds();
        const newGame = Game(originalGameData);

        const newGameData = newGame.toJson();
        expect(newGameData).to.deep.equal(originalGameData);

        const reconstructedGame = Game(newGameData);
        expect(reconstructedGame.toJson()).to.deep.equal(newGameData);
    });
});

describe('Game Entity Properties and Methods', () => {
    it(`has an automatically generated ID`, () => {
        const newGame = Game(validGame());
        const newId = newGame.getId();
        expect(newId).to.be.a('string');
        const expectedMessage = `Expected ${newId} to match regex ${validGameId}`;
        const matchedRegex = validGameId.test(newId)
        expect(matchedRegex, expectedMessage).to.equal(true);
    });

    it(`does not generate an id if one is present in the attributes`, () => {
        const idString = 'Existing ID';
        const gameAttributes = validGame();
        gameAttributes.id = idString;
        const newGame = Game(gameAttributes);

        expect(newGame.getId()).to.equal(idString);
    });

    it(`has a getType function that returns the name of the entity type`, () => {
        const newGame = Game(validGame());
        expect(newGame.getType()).to.equal('Game');
    });

    it(`has a getScenario function that returns the Scenario entity`, () => {
        const newGame = Game(validGame());

        const scenario = newGame.getScenario();
        expect(scenario.getType()).to.equal('Scenario');
    });

    it(`has a toJson method that returns the raw data for the Game`, () => {
        const newGame = Game(validGame());
        expect(validator.validateAs(newGame.toJson(), newGame.getType())).to.equal(true);
    });

    it(`returns copies from toJson, not original objects`, () => {
        const originalGameData = validGame();
        originalGameData.id = 'game_test_1234';

        const newGame = Game(originalGameData);
        const json = newGame.toJson();
        expect(json, 'Overall JSON').to.not.equal(originalGameData);
        expect(json.scenario, 'Scenario JSON').to.not.equal(originalGameData.scenario);
        expect(json.scenario.encounter, 'Encounter JSON').to.not.equal(originalGameData.scenario.encounter);
    });
});

const simpleBoard = {
    id: 'board_simple_1234',
    name: 'Simple Board',
    tiles: [['A']],
    terrain: {A: {name: 'A'}}
}

function validGameDataWithIds() {
    const originalGameData = validGame();
    originalGameData.id = 'Game_ID';
    originalGameData.scenario.id = 'Scenario_ID';
    originalGameData.scenario.encounter.id = 'Encounter_ID';
    originalGameData.scenario.encounter.board.id = 'Board_ID';
    originalGameData.scenario.encounter.units[0].id = 'Unit0_ID';
    originalGameData.scenario.encounter.units[1].id = 'Unit1_ID';
    return originalGameData;
}
