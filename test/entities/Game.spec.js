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

    it(`initializes the current game state using the first encounter if none is specified`, () => {
        const newGame = Game(validGame());
        expect(newGame.toJson().currentEncounterIndex).to.equal(0);
    });

    it(`initializes the current game state using another encounter if one is specified`, () => {
        const gameData = validGameDataWithIds();
        gameData.currentEncounterIndex = 1;
        const newGame = Game(gameData);
        expect(newGame.toJson().currentEncounterIndex).to.equal(1);
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

    it(`has a getState method that returns the current game state`, () => {
        const newGame = Game(gameDataForStateTest());
        expect(newGame.getState()).to.deep.equal(expectedGameState());
    });

    it(`getState returns an immutable object`, () => {
        const newGame = Game(validGame());
        const state = newGame.getState();
        expect(_ => state.name = 'Test Mutation').to.throw(/Cannot add property/);
        //TODO: deep-freeze (but not at the moment because this state is still in development)
        //expect(_ => state.board.terrain['Z'] = 'Test Mutation').to.throw(/Cannot add property/);
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
        expect(json.scenario.encounters[0], 'Encounter JSON').to.not.equal(originalGameData.scenario.encounters[0]);
    });
});

describe('Sending actions to the Game', () => {
    it(`has a sendAction method that takes a valid action message`, () => {
        const game = Game(validGame());
        expect(game.sendAction).to.be.a('function');
    });

    it(`throws an error if the action message is invalid`, () => {
        const game = Game(validGame());
        const sendBadMessageNone = () => game.sendAction()
        const sendBadMessageString = () => game.sendAction("bad data")
        const sendBadMessageArray = () => game.sendAction(["bad", "data"])
        const sendBadMessageObject = () => game.sendAction({"bad-property": true})

        expect(sendBadMessageNone).to.throw(/Invalid action/);
        expect(sendBadMessageString).to.throw(/Invalid action/);
        expect(sendBadMessageArray).to.throw(/Invalid action/);
        expect(sendBadMessageObject).to.throw(/Invalid action/);
    });
});

describe('Game Action - Start Encounter and New Encounter Game State', () => {
    it(`throws an error if the encounter index is missing or bad`, () => {
        const game = Game(validGame());
        const action = "startEncounter";

        const messageMissingEncounterIndex = () => game.sendAction({action});
        const messageNegativeEncounterIndex = () => game.sendAction({action, encounterIndex: -1});
        const messageEncounterIndexTooBig = () => game.sendAction({action, encounterIndex: 999});

        expect(messageMissingEncounterIndex).to.throw(/Start Encounter failed: missing encounter index/);
        expect(messageNegativeEncounterIndex).to.throw(/Start Encounter failed: invalid encounter index/);
        expect(messageEncounterIndexTooBig).to.throw(/Start Encounter failed: invalid encounter index/);
    });

    it(`resets the current game state for the new encounter`, () => {
        const game = Game(gameDataForStateTest());
        game.sendAction({action: 'startEncounter', encounterIndex: 1});
        expect(game.getState()).to.deep.equal(expectedGameState());
        expect(game.toJson().currentEncounterIndex).to.equal(1);
    });
});

describe('Game Action - Add Unit', () => {
    it(`throws an error if no unit is specified`, () => {
        const game = Game(validGame());
        const messageMissingUnit = () => game.sendAction({action: "addUnit"});
        expect(messageMissingUnit).to.throw(/Add Unit failed: missing unit id/);
    });

    it(`throws an error if the specified unit does not exist in the list of units`, () => {
        const game = Game(validGame());
        const unitNotFound = () => game.sendAction({action: "addUnit", unitId: "bogus", boardX: 0, boardY: 0});
        expect(unitNotFound).to.throw(/Add Unit failed: could not find unit with id/);
    });

    it(`throws an error if the specified board location is invalid`, () => {
        const game = Game(validGame());

        const action = 'addUnit';
        const unitId = game.getScenario().getEncounter(0).getUnits()[0].getId();

        const messageMissingBoard = () => game.sendAction({action: "addUnit", unitId});
        const badBoardXmin = () => game.sendAction({action, unitId, boardX: -1, boardY: 0});
        const badBoardXmax = () => game.sendAction({action, unitId, boardX: 999, boardY: 0});
        const badBoardYmin = () => game.sendAction({action, unitId, boardX: 0, boardY: -1});
        const badBoardYmax = () => game.sendAction({action, unitId, boardX: 0, boardY: 999});

        expect(messageMissingBoard).to.throw(/Add Unit failed: missing board coordinates/);
        expect(badBoardXmin).to.throw(/Add Unit failed: board coordinates out of bounds/);
        expect(badBoardXmax).to.throw(/Add Unit failed: board coordinates out of bounds/);
        expect(badBoardYmin).to.throw(/Add Unit failed: board coordinates out of bounds/);
        expect(badBoardYmax).to.throw(/Add Unit failed: board coordinates out of bounds/);
    });

    it(`adds a unit to the specified tile`, () => {
        const game = Game(validGame());
        const unitToAdd = game.getScenario().getEncounter(0).getUnits()[0];
        const unitId = unitToAdd.getId();
        game.sendAction({action: 'addUnit', unitId, boardX: 0, boardY: 0});

        const newState = game.getState();
        expect(newState.units.length).to.equal(1);
        const unit = newState.units[0];
        expect(unit.name).to.equal(unitToAdd.getName());
    });

    it(`throws an error if the specified board location already contains a unit`, () => {
        const game = Game(validGame());
        const unitToAdd = game.getScenario().getEncounter(0).getUnits()[0];
        const unitId = unitToAdd.getId();
        const addUnitAction = {action: 'addUnit', unitId, boardX: 0, boardY: 0};
        game.sendAction(addUnitAction)

        const messageUnitConflict = () => game.sendAction(addUnitAction);
        expect(messageUnitConflict).to.throw(/Add Unit failed: cannot add unit at specified coordinates/);
    });
});

describe('Game Action - Move Unit', () => {
    it(`throws an error if no unit or direction is specified`, () => {
        const game = validGameWithOneUnit();
        const messageMissingUnit = () => game.sendAction({action: "moveUnit"});
        expect(messageMissingUnit).to.throw(/Move Unit failed: missing unit index/);

        const messageMissingDirection = () => game.sendAction({action: "moveUnit", unitIndex: 0});
        expect(messageMissingDirection).to.throw(/Move Unit failed: missing direction/);
    });

    it(`throws an error if the specified unit does not exist in the list of units`, () => {
        const game = validGameWithOneUnit();
        const unitNotFound = () => game.sendAction({action: "moveUnit", unitIndex: 1, direction: 'n'});
        expect(unitNotFound).to.throw(/Move Unit failed: could not find unit with index/);
    });

    it(`throws an error if the specified direction is invalid`, () => {
        const game = validGameWithOneUnit();
        const unitNotFound = () => game.sendAction({action: "moveUnit", unitIndex: 0, direction: 'Foo'});
        expect(unitNotFound).to.throw(/Invalid action/);
    });

    it(`throws an error if the board location in the specified direction is invalid`, () => {
        const game = validGameWithOneUnit();
        const action = 'moveUnit';
        const unitIndex = 0;

        const moveOffBoardY = () => game.sendAction({action, unitIndex, direction: 'n'});
        const moveOffBoardX = () => game.sendAction({action, unitIndex, direction: 'w'});
        const moveOffBoardD = () => game.sendAction({action, unitIndex, direction: 'nw'});

        expect(moveOffBoardY).to.throw(/Move Unit failed: destination is out of bounds/);
        expect(moveOffBoardX).to.throw(/Move Unit failed: destination is out of bounds/);
        expect(moveOffBoardD).to.throw(/Move Unit failed: destination is out of bounds/);
    });

    it(`throws an error if the specified board location already contains a unit`, () => {
        const game = validGameWithOneUnit();
        const unitToAdd = game.getScenario().getEncounter(0).getUnits()[0];
        const unitId = unitToAdd.getId();
        const addUnitAction = {action: 'addUnit', unitId, boardX: 1, boardY: 0};
        game.sendAction(addUnitAction)

        const moveUnitAction = {action: 'moveUnit', unitIndex: 0, direction: 'e'};
        const messageUnitConflict = () => game.sendAction(moveUnitAction);
        expect(messageUnitConflict).to.throw(/Move Unit failed: destination is occupied/);
    });

    //terrain is impassable
    //unit is out of movement
    //

    it(`Moves the unit to the specified tile`, () => {
        const game = validGameWithOneUnit();
        const moveUnitAction = {action: 'moveUnit', unitIndex: 0, direction: 'e'};
        game.sendAction(moveUnitAction);

        const unit = game.getState().units[0];
        expect(unit.positionX).to.equal(1);
        expect(unit.positionY).to.equal(0);
    });
});


function validGameDataWithIds() {
    const originalGameData = validGame();
    originalGameData.id = 'Game_ID';
    originalGameData.scenario.id = 'Scenario_ID';
    originalGameData.scenario.encounters[0].id = 'Encounter_ID0';
    originalGameData.scenario.encounters[0].board.id = 'Board_ID0';
    originalGameData.scenario.encounters[0].units[0].id = 'Unit0_ID0';
    originalGameData.scenario.encounters[0].units[1].id = 'Unit1_ID0';
    originalGameData.scenario.encounters[1].id = 'Encounter_ID1';
    originalGameData.scenario.encounters[1].board.id = 'Board_ID1';
    originalGameData.scenario.encounters[1].units[0].id = 'Unit0_ID1';
    originalGameData.scenario.encounters[1].units[1].id = 'Unit1_ID1';
    return originalGameData;
}

function validGameWithOneUnit() {
    const game = Game(validGame());
    const unitToAdd = game.getScenario().getEncounter(0).getUnits()[0];
    const unitId = unitToAdd.getId();
    const addUnitAction = {action: 'addUnit', unitId, boardX: 0, boardY: 0};
    game.sendAction(addUnitAction)
    return game;
}

const simpleBoard = {
    id: 'board_simple_1234',
    name: 'Simple Board',
    tiles: [['A']],
    terrain: {A: {name: 'A'}}
}

const complexBoard = {
    id: 'board_complex_1235',
    name: 'Complex Board',
    tiles: [
        ['A', 'B', 'A', 'B', 'A'],
        ['B', 'B', 'A', 'A', 'A'],
        ['A', 'A', 'A', 'A', 'A'],
        ['A', 'A', 'A', 'A', 'A']
    ],
    terrain: {
        A: {name: 'A'},
        B: {name: 'B'}
    }
}

function gameDataForStateTest() {
    return {
        id: 'game_simple_1234',
        name: 'Test Game',
        scenario: {
            id: 'scenario_simple_1234',
            name: 'Test Scenario',
            encounters: [{
                id: 'encounter_simple_1234',
                name: 'Test Encounter',
                description: 'A simple encounter',
                board: simpleBoard,
                units: [
                    {
                        id: 'unit_simple_1234',
                        name: 'Test Unit',
                        movement: 5
                    }
                ]
            }, {
                id: 'encounter_simple_1235',
                name: 'Test Encounter 2',
                description: 'A complex encounter',
                board: complexBoard,
                units: [
                    {
                        id: 'unit_simple_1235',
                        name: 'Test Unit 2',
                        movement: 6
                    }
                ]
            }]
        }
    }
}

function expectedGameState() {
    return {
        units: []
    };
}
