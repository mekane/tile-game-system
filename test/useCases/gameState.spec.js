const expect = require('chai').expect;
const {mockRepository, spyRepository, inMemoryRepository, stubRepository} = require('../_mocks');
const {validBoard, validGame} = require('../_fixtures');
const {GameState} = require('../../src/useCases/gameState');
const Board = require('../../src/entities/Board');

const testId = 'test_id';

function testGameRepository() {
    const testGameData = validGame();
    testGameData.id = testId;
    return inMemoryRepository({[testId]: testGameData});
}

describe('The GameState Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(GameState).to.be.a('function');
    });

    it('returns a function from the initializer that calls the use case', () => {
        const gameState = GameState({gameRepository: mockRepository()});
        expect(gameState).to.be.a('function');
    });
});

describe('The GameState Use Case Function', () => {
    it(`returns an error status if the game is not found by id`, async () => {
        const gameState = GameState({gameRepository: mockRepository()});
        const result = await gameState('bad_id');
        expect(result).to.deep.equal({
            success: false,
            error: `No Game found for id bad_id`
        });
    });

    it(`uses the GameRepository to find the Game by id`, async () => {
        const gameSpy = spyRepository();
        const gameState = GameState({gameRepository: gameSpy});
        await gameState('a_game_id');
        expect(gameSpy.getCalled).to.equal(1);
    });

    it(`returns the current game state (not internal Game json form) for the Game`, async () => {
        const gameRepository = testGameRepository();
        const gameState = GameState({gameRepository});
        const actualState = await gameState(testId);
        expect(actualState).to.deep.equal({
            success: true,
            state: {
                units: []
            },
            tiles: Board(validBoard()).getViewData()
        });
    });
});
