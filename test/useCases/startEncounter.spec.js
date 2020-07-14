const expect = require('chai').expect;
const {mockRepository, spyRepository, inMemoryRepository} = require('../_mocks');
const {validGame} = require('../_fixtures');

const {StartEncounter} = require('../../src/useCases/StartEncounter');

const testId = 'test_id';

function testGameRepository() {
    const testGameData = validGame();
    testGameData.id = testId;
    return inMemoryRepository({[testId]: testGameData});
}

describe('The StartEncounter Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(StartEncounter).to.be.a('function');
    });

    it('returns a constructor function from the initializer', () => {
        const startEncounter = StartEncounter({
            gameRepository: mockRepository(),
        });
        expect(startEncounter).to.be.a('function');
    });
});

describe('The StartEncounter Use Case function', () => {
    it(`returns an error status if the game is not found by id`, async () => {
        const startEncounter = StartEncounter({gameRepository: testGameRepository()});
        const result = await startEncounter('bad_id', 1);
        expect(result).to.deep.equal({
            success: false,
            error: `No Game found for id bad_id`
        });
    });

    it(`returns an error status if the encounter number is invalid`, async () => {
        const startEncounter = StartEncounter({gameRepository: testGameRepository()});

        const resultNoNumber = await startEncounter(testId);
        expect(resultNoNumber).to.deep.equal({
            success: false,
            error: `missing encounter number`
        });

        const resultNegative = await startEncounter(testId, -1);
        expect(resultNegative).to.deep.equal({
            success: false,
            error: `invalid encounter number`
        });

        const resultTooBig = await startEncounter(testId, 99);
        expect(resultTooBig).to.deep.equal({
            success: false,
            error: `invalid encounter number`
        });
    });

    it(`uses the GameRepository to find the game by id`, () => {
        const gameSpy = spyRepository();
        const startEncounter = StartEncounter({gameRepository: gameSpy});

        startEncounter('test', 1);
        expect(gameSpy.getCalled).to.equal(1);
    });

    it(`returns an OK status message if the game was created`, async () => {
        const startEncounter = StartEncounter({gameRepository: testGameRepository()});
        const result = await startEncounter(testId, 1);
        expect(result).to.deep.equal({
            success: true
        });
    });

    it(`saves the Game instance back to the Game repository`, async () => {
        const gameRepository = testGameRepository();
        const startEncounter = StartEncounter({gameRepository});
        await startEncounter(testId, 1);

        const game = gameRepository.getById(testId);
        expect(game.currentEncounterIndex).to.equal(1);
    });
});
