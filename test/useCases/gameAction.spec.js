const expect = require('chai').expect;
const {mockRepository, spyRepository, inMemoryRepository, stubRepository} = require('../_mocks');
const {validGame, validGameAction} = require('../_fixtures');

const GameActionUseCase = require('../../src/useCases/gameAction');

const testId = 'test_id';

function testGameRepository() {
    const testGameData = validGame();
    testGameData.id = testId;
    return inMemoryRepository({[testId]: testGameData});
}

describe('The GameAction Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(GameActionUseCase).to.be.a('function');
    });

    it('returns a constructor function from the initializer', () => {
        const gameAction = GameActionUseCase({gameRepository: mockRepository()});
        expect(gameAction).to.be.a('function');
    });
});

describe('The GameAction Use Case Function', () => {
    it(`returns an error status if the game is not found by id`, async () => {
        const gameAction = GameActionUseCase({gameRepository: mockRepository()});
        const result = await gameAction('bad_id', validGameAction());
        expect(result).to.deep.equal({
            success: false,
            error: `No Game found for id bad_id`
        });
    });

    it(`returns an error status if the game action is rejected`, async () => {
        const gameAction = GameActionUseCase({gameRepository: testGameRepository()});
        const result = await gameAction('test_id', {action: 'invalidGameAction'});
        expect(result).to.deep.equal({
            success: false,
            error: `Invalid action`
        });
    });

    it(`uses the GameRepository to find the Game by id`, async () => {
        const gameSpy = spyRepository();
        const gameAction = GameActionUseCase({gameRepository: gameSpy});
        await gameAction('a_game_id', validGameAction());

        expect(gameSpy.getCalled).to.equal(1);
    });

    it(`sends the action to the Game`, async () => {
        const gameRepository = testGameRepository();
        const gameAction = GameActionUseCase({gameRepository});
        await gameAction(testId, {action: 'startEncounter', encounterIndex: 1});

        const game = gameRepository.getById(testId);
        console.log(game);
        expect(game.currentEncounterIndex).to.equal(1);
    });

    it(`returns an OK status message if the action was accepted`, async () => {
        const gameAction = GameActionUseCase({gameRepository: testGameRepository()});
        const result = await gameAction(testId, {action: 'startEncounter', encounterIndex: 1});
        expect(result).to.deep.equal({
            success: true
        });
    });

    it(`saves the Game back to the repository`, async () => {
        const gameSpy = spyRepository();
        gameSpy.getById = _ => validGame(); //stub out a game so it gets to the save part

        const gameAction = GameActionUseCase({gameRepository: gameSpy});
        await gameAction('a_game_id', {action: 'startEncounter', encounterIndex: 1});

        expect(gameSpy.saveCalled).to.equal(1);
    });
});
