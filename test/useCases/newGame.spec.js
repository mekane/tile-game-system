const expect = require('chai').expect;
const {mockRepository, spyRepository, inMemoryRepository} = require('../_mocks');
const {validScenario} = require('../_fixtures');

const validator = require('../../src/validator');
const NewGameUseCase = require('../../src/useCases/newGame');

const testScenario = validScenario();
const testScenarioID = 'Test_Scenario_ID';
testScenario.id = testScenarioID;
const testScenarioRepository = inMemoryRepository({[testScenarioID]: testScenario});

describe('The NewGame Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(NewGameUseCase).to.be.a('function');
    });

    it('returns a constructor function from the initializer', () => {
        const newGame = NewGameUseCase({
            gameRepository: mockRepository(),
            scenarioRepository: mockRepository(),
        });
        expect(newGame).to.be.a('function');
    });
});

describe('The NewGame Use Case function', () => {
    it(`returns an error status if the scenario is not found by id`, async () => {
        const newGame = NewGameUseCase({
            gameRepository: mockRepository(),
            scenarioRepository: mockRepository()
        });
        const result = await newGame({name: 'test', scenarioId: 'bad_id'});
        expect(result).to.deep.equal({
            success: false,
            error: `No Scenario found with id bad_id`
        });
    });

    it(`uses the ScenarioRepository to find the referenced scenario`, () => {
        const scenarioSpy = spyRepository();
        const newGame = NewGameUseCase({
            gameRepository: mockRepository(),
            scenarioRepository: scenarioSpy
        });
        newGame({name: 'test', scenarioId: 'test'});
        expect(scenarioSpy.getCalled).to.equal(1);
    });

    it(`returns an OK status message if the game was created`, async () => {
        const newGame = NewGameUseCase({
            gameRepository: mockRepository(),
            scenarioRepository: testScenarioRepository
        });
        const result = await newGame({name: 'Test', scenarioId: testScenarioID});
        expect(result).to.deep.equal({
            success: true
        });
    });

    it(`puts the new Game instance into the Game repository`, async () => {
        const gameSpy = spyRepository();
        const newGame = NewGameUseCase({
            gameRepository: gameSpy,
            scenarioRepository: testScenarioRepository
        });
        await newGame({name: 'test', scenarioId: testScenarioID});
        expect(gameSpy.saveCalled).to.equal(1);
    });
});
