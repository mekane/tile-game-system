const expect = require('chai').expect;
const {mockRepository, spyRepository, inMemoryRepository, stubRepository} = require('../../_mocks.js');
const {validGame} = require('../../_fixtures.js');

const {GameAction} = require('../../../engine/useCases/gameAction.js');

const testId = 'test_id';

function testGameRepository() {
    const testGameData = validGame();
    testGameData.id = testId;
    return inMemoryRepository({[testId]: testGameData});
}

describe('The GameAction Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(GameAction).to.be.a('function');
    });

    it('returns a function from the initializer that calls the use case', () => {
        const gameAction = GameAction({gameRepository: mockRepository()});
        expect(gameAction).to.be.a('function');
    });
});

describe('The GameAction Use Case Function', () => {
    it(`returns an error status if the game is not found by id`, async () => {
        const gameAction = GameAction({gameRepository: mockRepository()});
        const result = await gameAction('bad_id', validGameAction());
        expect(result).to.deep.equal({
            success: false,
            error: `No Game found for id bad_id`
        });
    });

    it(`returns an error status if the action is unknown`, async () => {
        const gameAction = GameAction({gameRepository: testGameRepository()});
        const result = await gameAction('test_id', {action: 'invalidGameAction'});
        expect(result).to.deep.equal({
            success: false,
            error: `Unknown action: invalidGameAction`
        });
    });

    it(`uses the GameRepository to find the Game by id`, async () => {
        const gameSpy = spyRepository();
        const gameAction = GameAction({gameRepository: gameSpy});
        await gameAction('a_game_id', validGameAction());

        expect(gameSpy.getCalled).to.equal(1);
    });

    //TODO: make this work
    it.skip(`sends the events resulting from the action to the Game`, async () => {
        const gameRepository = testGameRepository();
        const gameAction = GameAction({gameRepository});
        await gameAction(testId, validGameAction());

        const game = gameRepository.getById(testId);
        expect(game.currentState.units.length).to.equal(1);
    });

    //TODO: test an injected other action

    //TODO: test an injected action that returns multiple events

    //TODO: fix
    it.skip(`returns an OK status message if the action was accepted`, async () => {
        const gameAction = GameAction({gameRepository: testGameRepository()});
        const result = await gameAction(testId, validGameAction());
        expect(result).to.deep.equal({
            success: true
        });
    });

    //TODO: fix
    it.skip(`saves the Game back to the repository`, async () => {
        const gameSpy = spyRepository();
        gameSpy.getById = _ => validGame(); //stub out a game so it gets to the save part

        const gameAction = GameAction({gameRepository: gameSpy});
        await gameAction('a_game_id', validGameAction());

        expect(gameSpy.saveCalled).to.equal(1);
    });
});

function validGameAction() {
    return {action: 'addUnit'}
}