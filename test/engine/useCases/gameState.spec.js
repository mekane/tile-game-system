const expect = require('chai').expect;
const {mockRepository, spyRepository, inMemoryRepository, stubRepository} = require('../../_mocks.js');
const {validBoard, validGame} = require('../../_fixtures.js');
const {GameState} = require('../../../engine/useCases/gameState.js');
const Board = require('../../../engine/entities/Board.js');

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
            activeLineOfSight: [],
            success: true,
            state: {
                activeGroup: null,
                activeUnit: null,
                units: [],
                unitsGroupedByTurnOrder: []
            },
            tiles: Board(validBoard()).getViewData()
        });
    });

    it(`computes the line of sight for the currently active unit and includes the results`, () => {
        //TODO: this will require a more complete integration test
    });
});
