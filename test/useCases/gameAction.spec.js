const expect = require('chai').expect;
const {mockRepository, spyRepository, inMemoryRepository, stubRepository} = require('../_mocks');
const {validGame, validGameAction} = require('../_fixtures');

const validator = require('../../src/validator');
const GameActionUseCase = require('../../src/useCases/gameAction');

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
        const gameRepository = mockRepository();
        const rejectActionAsInvalid = _ => {
            throw new Error('Invalid action')
        };
        gameRepository.getById = _ => ({sendAction: rejectActionAsInvalid});
        const gameAction = GameActionUseCase({gameRepository});

        const result = await gameAction('bad_id', validGameAction());
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
        const testAction = {action: 'startEncounter', encounterIndex: 1};

        let sentAction = null;
        const gameObjectSpy = {
            sendAction: a => sentAction = a
        }
        const gameRepository = inMemoryRepository({'test_id': gameObjectSpy});
        const gameAction = GameActionUseCase({gameRepository});

        await gameAction('test_id', testAction);

        expect(sentAction).to.deep.equal(testAction);
    });

    it(`returns an OK status message if the action was accepted`, async () => {
        const gameAction = GameActionUseCase({gameRepository: stubRepository()});
        const result = await gameAction('bad_id', validGameAction());
        expect(result).to.deep.equal({
            success: true
        });
    });

    it(`saves the Game back to the repository`, async () => {
        const gameSpy = spyRepository();
        gameSpy.getById = _ => ({sendAction: () => null}); //stub out a game so it gets to the save part

        const gameAction = GameActionUseCase({gameRepository: gameSpy});
        await gameAction('a_game_id', validGameAction());

        expect(gameSpy.saveCalled).to.equal(1);
    })
});
