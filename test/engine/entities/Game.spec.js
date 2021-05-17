'use strict'
const expect = require('chai').expect;
const {gameDataWithMoreEncounterDetail, validEncounterWithInitialUnit, validGame} = require('../../_fixtures.js');
const validator = require('../../../engine/validator.js');

const Game = require('../../../engine/entities/Game.js');
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
    });

    it(`returns a Game object if the attributes are valid`, () => {
        expect(Game(validGame())).to.be.an('object');
    });

    it(`returns an immutable object`, () => {
        const newGame = Game(validGame());
        expect(_ => newGame.name = 'Test Mutation').to.throw(/Cannot add property/);
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

    it(`has a getCurrentBoard method that returns the board for the current encounter`, () => {
        const encounterData0 = gameDataWithMoreEncounterDetail().scenario.encounters[0];
        const encounterData1 = gameDataWithMoreEncounterDetail().scenario.encounters[1];

        const expectedBoard0 = encounterData0.board;
        const expectedBoard1 = encounterData1.board;

        const game = Game(gameDataWithMoreEncounterDetail());
        const actualBoard0 = game.getCurrentBoard().toJson();
        game.startEncounter(0);
        expect(actualBoard0).to.deep.equal(expectedBoard0);

        game.startEncounter(1);
        const actualBoard1 = game.getCurrentBoard().toJson();
        expect(actualBoard1).to.deep.equal(expectedBoard1);
    });

    it(`has a getActiveUnit method that returns a copy of the properties for the current unit`, () => {
        const gameData = validGameWithVarietyOfUnits();
        gameData.scenario.encounters[1].init = [
            {action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1},
            {action: 'addUnit', unitName: 'Alien', boardX: 1, boardY: 2}
        ];
        const game = Game(gameData);
        game.startEncounter(1);
        const state = game.getState();

        expect(game.getActiveUnit()).to.not.equal(state.units[state.activeUnit]);
        expect(game.getActiveUnit()).to.deep.equal(state.units[state.activeUnit]);

        game.sendEvent({action: 'doneActivating', unitIndex: 0});

        expect(game.getActiveUnit()).to.not.equal(state.units[state.activeUnit]);
        expect(game.getActiveUnit()).to.deep.equal(state.units[state.activeUnit]);
    });

    it(`has a getType function that returns the name of the entity type`, () => {
        const newGame = Game(validGame());
        expect(newGame.getType()).to.equal('Game');
    });

    it(`has a getState method that returns the current game state`, () => {
        const newGame = Game(validGame());
        expect(newGame.getState()).to.deep.equal(expectedGameState());
    });

    it(`has a toJson method that returns the raw data for the Game`, () => {
        const newGame = Game(validGame());
        expect(validator.validateAs(newGame.toJson(), newGame.getType())).to.equal(true);
    });
});

describe('Starting a new encounter', () => {
    it(`throws an error if the encounter index is missing or bad`, () => {
        const game = Game(validGame());

        const startEncounterNoIndex = () => game.startEncounter();
        expect(startEncounterNoIndex).to.throw(/missing encounter number/);

        const startEncounterNegative = () => game.startEncounter(-1);
        const startEncounterTooHigh = () => game.startEncounter(999);

        expect(startEncounterNegative).to.throw(/invalid encounter number/);
        expect(startEncounterTooHigh).to.throw(/invalid encounter number/);
    });

    it(`resets the current game state for the new encounter`, () => {
        const game = Game(validGame());
        game.startEncounter(1);
        expect(game.getState()).to.deep.equal(expectedGameState());
        expect(game.toJson().currentEncounterIndex).to.equal(1);
    });

    //TODO: want these to be initial _Events_
    it(`executes actions to initialize the encounter`, () => {
        const gameData = validGame();
        const encounterWithInit = validEncounterWithInitialUnit();
        gameData.scenario.encounters.push(encounterWithInit);
        const game = Game(gameData);
        game.startEncounter(2);

        expect(game.getState().units).to.have.length(1);
        //TODO: this would be a good use of the "action log" on the game
    });

    it(`sorts the units by turn order and sets initial active values`, () => {
        const gameData = validGameWithVarietyOfUnits();
        gameData.scenario.encounters[1].init = [
            {action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1},
            {action: 'addUnit', unitName: 'Marine', boardX: 2, boardY: 1},
            {action: 'addUnit', unitName: 'Marine', boardX: 3, boardY: 1},
            {action: 'addUnit', unitName: 'Alien', boardX: 1, boardY: 2},
            {action: 'addUnit', unitName: 'Alien', boardX: 2, boardY: 2},
            {action: 'addUnit', unitName: 'Blob', boardX: 1, boardY: 3}
        ];
        const game = Game(gameData);
        game.startEncounter(1);
        const state = game.getState();

        const expectedGroups = [
            [0, 1, 2],
            [3, 4],
            [5]
        ];
        expect(state.unitsGroupedByTurnOrder).to.deep.equal(expectedGroups);
        expect(state.activeGroup).to.equal(0);
        expect(state.activeUnit).to.equal(0);
    });

    it(`sets the activeUnitIndex to the first unit in the list in the first group`, () => {
        const gameData = validGameWithVarietyOfUnits();
        gameData.scenario.encounters[1].init = [
            {action: 'addUnit', unitName: 'Blob', boardX: 1, boardY: 3},
            {action: 'addUnit', unitName: 'Alien', boardX: 1, boardY: 2},
            {action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1},
            {action: 'addUnit', unitName: 'Alien', boardX: 2, boardY: 2},
            {action: 'addUnit', unitName: 'Marine', boardX: 2, boardY: 1},
            {action: 'addUnit', unitName: 'Marine', boardX: 3, boardY: 1}
        ];
        const game = Game(gameData);
        game.startEncounter(1);

        const expectedGroups = [
            [2, 4, 5],
            [1, 3],
            [0]
        ];
        const state = game.getState();
        expect(state.unitsGroupedByTurnOrder).to.deep.equal(expectedGroups);
        expect(state.activeGroup).to.equal(0);
        expect(state.activeUnit).to.equal(2);
    });

    it(`sorts in the the turn order groups correctly according to the original unit turn order`, () => {
        const gameData = validGameWithUnitsForOrderTest();
        gameData.scenario.encounters[1].init = [
            {action: 'addUnit', unitName: 'U29', boardX: 3, boardY: 1},
            {action: 'addUnit', unitName: 'U20', boardX: 2, boardY: 1},
            {action: 'addUnit', unitName: 'U11', boardX: 2, boardY: 2},
            {action: 'addUnit', unitName: 'U10', boardX: 1, boardY: 1},
            {action: 'addUnit', unitName: 'U09', boardX: 1, boardY: 2},
            {action: 'addUnit', unitName: 'U01', boardX: 1, boardY: 3}
        ];
        const game = Game(gameData);
        game.startEncounter(1);

        const expectedGroups = [[5], [4], [3], [2], [1], [0]];
        const state = game.getState();
        expect(state.unitsGroupedByTurnOrder).to.deep.equal(expectedGroups);
        expect(state.activeGroup).to.equal(0);
        expect(state.activeUnit).to.equal(5);
    });
});

describe('Sending events to the Game', () => {
    it(`has a sendEvent method that takes a valid action message`, () => {
        const game = Game(validGame());
        expect(game.sendEvent).to.be.a('function');
    });

    it(`throws an error if the action message is invalid`, () => {
        const game = Game(validGame());
        const sendBadMessageNone = () => game.sendEvent()
        const sendBadMessageString = () => game.sendEvent("bad data")
        const sendBadMessageArray = () => game.sendEvent(["bad", "data"])
        const sendBadMessageObject = () => game.sendEvent({"bad-property": true})

        expect(sendBadMessageNone).to.throw(/Invalid action/);
        expect(sendBadMessageString).to.throw(/Invalid action/);
        expect(sendBadMessageArray).to.throw(/Invalid action/);
        expect(sendBadMessageObject).to.throw(/Invalid action/);
    });
});


//NOTE: Game events are still tested here but they are much simpler.
// They don't need to worry about catching illegal conditions or
// anything, and can just be ignored if something is blatantly wrong.
describe('Game Event - AddUnit', () => {

// TODO: convert to EVENT
    it(`adds a unit to the specified tile`, () => {
        const game = Game(validGame());
        const unitToAdd = game.getScenario().encounters[0].units[0];
        const unitId = unitToAdd.id;
        game.sendEvent({action: 'addUnit', unitId, boardX: 0, boardY: 0});

        //convert to Event
        const newState = game.getState();
        expect(newState.units.length).to.equal(1);
        const unit = newState.units[0];
        expect(unit.name).to.equal(unitToAdd.name);
    });

// TODO: convert to EVENT
    it(`sets initial properties on the unit based on unit definition`, () => {
        const game = constructGameWithOneUnit();
        const unit = game.getState().units[0];

        expect(unit.id).to.be.an('undefined');
        expect(unit.definitionId).to.be.a('string');
        expect(unit.movementMax).to.equal(6);
        expect(unit.movementRemaining).to.equal(6);
        expect(unit.name).to.equal('Goblin');
        expect(unit.positionX).to.equal(0);
        expect(unit.positionY).to.equal(0);
        expect(unit.turnOrder).to.equal(1);
    });

// TODO: convert to EVENT
    it(`sets default values for optional properties not set on the unit definition`, () => {
        const gameData = validGame();
        delete gameData.scenario.encounters[0].units[0].turnOrder;
        const game = Game(gameData);
        game.sendEvent({action: 'addUnit', unitName: 'Goblin', boardX: 1, boardY: 1});

        const unit = game.getState().units[0];
        expect(unit.turnOrder).to.equal(99);
    });

// TODO: convert to EVENT
    it(`adds the unit to its turn order group`, () => {
        const game = Game(validGame());
        game.sendEvent({action: 'addUnit', unitName: 'Goblin', boardX: 0, boardY: 0});

        const state = game.getState();
        expect(state.unitsGroupedByTurnOrder).to.deep.equal([[0]]);
        expect(state.activeGroup).to.equal(0);
        expect(state.activeUnit).to.equal(0);
    });

// TODO: convert to EVENT
    it(`adds additional units to the active unit group for the same initiative order`, () => {
        const game = Game(validGame());
        game.sendEvent({action: 'addUnit', unitName: 'Goblin', boardX: 0, boardY: 0});
        game.sendEvent({action: 'addUnit', unitName: 'Goblin', boardX: 1, boardY: 0});

        const state = game.getState();
        expect(state.unitsGroupedByTurnOrder).to.deep.equal([[0, 1]]);
        expect(state.activeGroup).to.equal(0);
        expect(state.activeUnit).to.equal(0);
    });

// TODO: convert to EVENT
    it(`adds additional unit groups for different turn orders`, () => {
        const game = Game(validGameWithVarietyOfUnits());
        game.startEncounter(1);
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1});
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 2, boardY: 1});
        game.sendEvent({action: 'addUnit', unitName: 'Alien', boardX: 3, boardY: 1});

        const state = game.getState();
        expect(state.unitsGroupedByTurnOrder).to.deep.equal([[0, 1], [2]]);
    });

// TODO: convert to EVENT
    it(`doesn't mess up the turn order state if adding in an in-progress encounter`, () => {
        const game = Game(validGameWithVarietyOfUnits());
        game.startEncounter(1);
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1});
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 2, boardY: 1});
        game.sendEvent({action: 'addUnit', unitName: 'Alien', boardX: 3, boardY: 1});

        game.sendEvent({action: 'doneActivating', unitIndex: 0});
        game.sendEvent({action: 'doneActivating', unitIndex: 1});
        game.sendEvent({action: 'addUnit', unitName: 'Alien', boardX: 2, boardY: 2});

        const state = game.getState();
        expect(state.unitsGroupedByTurnOrder).to.deep.equal([[0, 1], [2, 3]]);
        expect(state.activeGroup).to.equal(1);
        expect(state.activeUnit).to.equal(2);
    });
});

describe('Game Action - Move Unit', () => {
    //TODO: convert to EVENT
    it(`reduces the unit's movement remaining by one (by default)`, () => {
        const game = constructGameWithOneUnit();

        game.sendEvent({action: 'moveUnit', unitIndex: 0, direction: 'se'});

        const unit = game.getState().units[0];
        expect(unit.movementMax).to.equal(6);
        expect(unit.movementRemaining).to.equal(5);
    });

    //TODO: convert to EVENT
    it(`reduces the unit's movement remaining by the defined amount on the tile`, () => {
        const game = Game(gameDataWithMoreEncounterDetail());
        game.startEncounter(1);

        const unitToAdd = game.getScenario().encounters[1].units[0];
        game.sendEvent({action: 'addUnit', unitId: unitToAdd.id, boardX: 1, boardY: 1});

        game.sendEvent({action: 'moveUnit', unitIndex: 0, direction: 's'});
        const unit = game.getState().units[0];
        expect(unit.movementMax).to.equal(6);
        expect(unit.movementRemaining).to.equal(4);
    });

    //TODO: convert to EVENT
    it(`moves the unit to the specified tile`, () => {
        const game = constructGameWithOneUnit();
        const moveUnitAction = {action: 'moveUnit', unitIndex: 0, direction: 'e'};
        game.sendEvent(moveUnitAction);

        const unit = game.getState().units[0];
        expect(unit.positionX).to.equal(1);
        expect(unit.positionY).to.equal(0);
    });

    //TODO: convert to EVENT (with options),
    // and TODO: add more options
    it(`marks the unit as having acted (but not done)`, () => {
        const game = constructGameWithOneUnit();
        game.sendEvent({action: 'moveUnit', unitIndex: 0, direction: 'e'});

        expect(game.getState().units[0].hasActivated).to.equal(true);
        expect(game.getState().units[0].doneActivating).to.be.an('undefined');
    });
});

describe('Game Action - Activate Unit', () => {
    //EVENT
    it(`sets the activeUnitIndex value`, () => {
        const gameData = validGameWithVarietyOfUnits();
        gameData.scenario.encounters[1].init = [
            {action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1}, // group 0
            {action: 'addUnit', unitName: 'Marine', boardX: 2, boardY: 1}, // group 0
            {action: 'addUnit', unitName: 'Alien', boardX: 2, boardY: 2} // group 1
        ];
        const game = Game(gameData);
        game.startEncounter(1);
        game.sendEvent({action: 'activateUnit', unitIndex: 1});

        const state = game.getState();
        expect(state.activeGroup).to.equal(0);
        expect(state.activeUnit).to.equal(1);
    });

    /** NOTE: this would be a good candidate for a Game option,
     * because not all games are going to want to enforce that each unit can only activate once.
     * However, this is basically the way to prevent arbitrary interleaving of turns.
     */
    //EVENT
    it(`marks the previously active unit done if it had activated`, () => {
        const gameData = validGameWithVarietyOfUnits();
        gameData.scenario.encounters[1].init = [
            {action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1},
            {action: 'addUnit', unitName: 'Marine', boardX: 2, boardY: 1}
        ];
        const game = Game(gameData);
        game.startEncounter(1);
        game.sendEvent({action: 'moveUnit', unitIndex: 0, direction: 's'});
        game.sendEvent({action: 'activateUnit', unitIndex: 1});

        const state = game.getState();
        expect(state.units[0].doneActivating).to.equal(true);
        expect(state.units[1].doneActivating).to.be.an('undefined');
    });
});

describe('Game Action - Unit Done Activating', () => {
    //EVENT - TODO: options
    it(`marks the unit as done activating (and has acted)`, () => {
        const game = constructGameWithTwoUnits();
        game.sendEvent({action: 'doneActivating', unitIndex: 0});
        const newState = game.getState();
        expect(newState.units[0].doneActivating).to.equal(true);
        expect(newState.units[0].hasActivated).to.equal(true);
    });

    //EVENT
    it(`advances the activeUnit index to the next one in the active group`, () => {
        const game = Game(validGameWithVarietyOfUnits());
        game.startEncounter(1);
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1});
        game.sendEvent({action: 'addUnit', unitName: 'Alien', boardX: 1, boardY: 2});
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 2, boardY: 1});
        game.sendEvent({action: 'doneActivating', unitIndex: 0});
        const state = game.getState();
        expect(state.unitsGroupedByTurnOrder).to.deep.equal([[0, 2], [1]]);
        expect(state.activeGroup).to.equal(0);
        expect(state.activeUnit).to.equal(2);
    });

    //EVENT
    it(`checks to see if there are any units in the current activation group that need to go`, () => {
        const game = Game(validGameWithVarietyOfUnits());
        game.startEncounter(1);
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1});//0
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 2});//1
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 2, boardY: 1});//2
        game.sendEvent({action: 'addUnit', unitName: 'Alien', boardX: 2, boardY: 2});//3
        game.sendEvent({action: 'doneActivating', unitIndex: 0});
        game.sendEvent({action: 'doneActivating', unitIndex: 2});
        const state = game.getState();

        expect(state.unitsGroupedByTurnOrder).to.deep.equal([[0, 1, 2], [3]]);
        expect(state.activeGroup).to.equal(0);
        expect(state.activeUnit).to.equal(1);
    });

    //EVENT
    it(`advances the activeGroup index when all units in the current group are done`, () => {
        const game = Game(validGameWithVarietyOfUnits());
        game.startEncounter(1);
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1});
        game.sendEvent({action: 'addUnit', unitName: 'Alien', boardX: 1, boardY: 2});
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 2, boardY: 1});
        game.sendEvent({action: 'addUnit', unitName: 'Alien', boardX: 2, boardY: 2});

        const state = game.getState();
        expect(state.unitsGroupedByTurnOrder).to.deep.equal([[0, 2], [1, 3]]);

        game.sendEvent({action: 'doneActivating', unitIndex: 0});
        expect(game.getState().activeUnit).to.equal(2);
        expect(game.getState().activeGroup).to.equal(0);

        game.sendEvent({action: 'doneActivating', unitIndex: 2});
        expect(game.getState().activeUnit).to.equal(1);
        expect(game.getState().activeGroup).to.equal(1);

        game.sendEvent({action: 'doneActivating', unitIndex: 1});
        expect(game.getState().activeUnit).to.equal(3);
        expect(game.getState().activeGroup).to.equal(1);
    });

    //EVENT
    it(`resets the encounter (round) and unit properties when all units are done`, () => {
        const game = Game(validGameWithVarietyOfUnits());
        game.startEncounter(1);
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1});
        game.sendEvent({action: 'addUnit', unitName: 'Alien', boardX: 1, boardY: 2});
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 2, boardY: 3});
        game.sendEvent({action: 'addUnit', unitName: 'Alien', boardX: 2, boardY: 2});
        game.sendEvent({action: 'moveUnit', unitIndex: 0, direction: 'e'});
        game.sendEvent({action: 'doneActivating', unitIndex: 0});
        game.sendEvent({action: 'doneActivating', unitIndex: 2});
        game.sendEvent({action: 'doneActivating', unitIndex: 1});
        game.sendEvent({action: 'doneActivating', unitIndex: 3});
        const state = game.getState();
        expect(state.unitsGroupedByTurnOrder).to.deep.equal([[0, 2], [1, 3]]);
        expect(state.activeGroup).to.equal(0);
        expect(state.activeUnit).to.equal(0);
        const units = state.units;
        expect(units[0].hasActivated).to.equal(false);
        expect(units[0].doneActivating).to.equal(false);
        expect(units[0].movementRemaining).to.equal(units[0].movementMax);
        expect(units[1].hasActivated).to.equal(false);
        expect(units[1].doneActivating).to.equal(false);
        expect(units[1].movementRemaining).to.equal(units[1].movementMax);
    });

    //EVENT
    it(`correctly recognizes round end when units are activated out of order`, () => {
        const game = Game(validGameWithVarietyOfUnits());
        game.startEncounter(1);
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 1});
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 2, boardY: 1});
        game.sendEvent({action: 'addUnit', unitName: 'Marine', boardX: 1, boardY: 2});
        game.sendEvent({action: 'doneActivating', unitIndex: 0});
        game.sendEvent({action: 'activateUnit', unitIndex: 2});
        game.sendEvent({action: 'doneActivating', unitIndex: 2});
        game.sendEvent({action: 'doneActivating', unitIndex: 1});
        const state = game.getState();
        expect(state.unitsGroupedByTurnOrder).to.deep.equal([[0, 1, 2]]);
        expect(state.activeGroup).to.equal(0);
        expect(state.activeUnit).to.equal(0);
    });
});

describe('Serializing and Deserializing Games', () => {
    it(`can re-create itself from the output of its toJson method`, () => {
        const originalGameData = validGameDataWithIds();
        const newGame = Game(originalGameData);

        const newGameData = newGame.toJson();
        expect(newGameData.id).to.deep.equal(originalGameData.id);
        expect(newGameData.name).to.deep.equal(originalGameData.name);

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

    it(`restores the encounter state`, () => {
        const game = constructGameWithOneUnit();
        game.sendEvent({action: 'moveUnit', unitIndex: 0, direction: 'e'});

        const originalJson = game.toJson();

        const newGame = Game(originalJson);
        expect(newGame.toJson()).to.deep.equal(originalJson);
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

function constructGameWithOneUnit() {
    const gameData = validGame();
    gameData.scenario.encounters[0].init = [
        {action: 'addUnit', unitName: 'Goblin', boardX: 0, boardY: 0}
    ];
    const game = Game(gameData);
    game.startEncounter(0);
    return game;
}

function constructGameWithTwoUnits() {
    const gameData = validGame();
    gameData.scenario.encounters[0].init = [
        {action: 'addUnit', unitName: 'Goblin', boardX: 0, boardY: 0},
        {action: 'addUnit', unitName: 'Goblin', boardX: 1, boardY: 0}
    ];
    const game = Game(gameData);
    game.startEncounter(0);
    return game;
}

function validGameWithVarietyOfUnits() {
    const gameData = gameDataWithMoreEncounterDetail();
    const enc = gameData.scenario.encounters[1];
    enc.units = [
        {id: 'm1', name: 'Marine', movement: 4, turnOrder: 1},
        {id: 'a1', name: 'Alien', movement: 6, turnOrder: 3},
        {id: 'b1', name: 'Blob', movement: 6, turnOrder: 5},
    ];
    return gameData;
}

function validGameWithUnitsForOrderTest() {
    const gameData = gameDataWithMoreEncounterDetail();
    const enc = gameData.scenario.encounters[1];
    enc.units = [
        {id: 'u01', name: 'U01', movement: 4, turnOrder: 1},  //5
        {id: 'u09', name: 'U09', movement: 6, turnOrder: 9},  //4
        {id: 'u10', name: 'U10', movement: 6, turnOrder: 10}, //3
        {id: 'u11', name: 'U11', movement: 6, turnOrder: 11}, //2
        {id: 'u20', name: 'U20', movement: 6, turnOrder: 20}, //1
        {id: 'u29', name: 'U29', movement: 6, turnOrder: 29}, //0
    ];
    return gameData;
}

function expectedGameState() {
    return {
        units: [],
        unitsGroupedByTurnOrder: [],
        activeGroup: null,
        activeUnit: null
    };
}
