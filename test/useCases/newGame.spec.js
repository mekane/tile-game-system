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
    it(`uses the ScenarioRepository to find the referenced scenario`, () => {
        const scenarioSpy = spyRepository();
        const newGame = NewGameUseCase({
            gameRepository: mockRepository(),
            scenarioRepository: scenarioSpy
        });
        newGame({name: 'test', scenarioId: 'test'});
        expect(scenarioSpy.getCalled).to.equal(1);
    });

    it(`fetches the Scenario from the repository by id`, async () => {
        const newGame = NewGameUseCase({
            gameRepository: mockRepository(),
            scenarioRepository: testScenarioRepository
        });
        const game = await newGame({name: 'test', scenarioId: testScenarioID});
        const scenario = game.getScenario();

        expect(scenario.getType()).to.equal('Scenario');
        expect(scenario.getId()).to.equal(testScenarioID);
    });

    it(`returns the new Game instance`, async () => {
        const newGame = NewGameUseCase({
            gameRepository: mockRepository(),
            scenarioRepository: testScenarioRepository
        });
        const game = await newGame({name: 'Test', scenarioId: testScenarioID});

        expect(game).to.be.an('object');
        expect(game.getId().startsWith('game_test_')).to.equal(true);
        expect(game.getType()).to.equal('Game');
        expect(validator.validateAs(game.toJson(), game.getType())).to.equal(true);
    });

    it(`puts the new Game instance into the Game repository`, () => {
        const gameSpy = spyRepository();
        const newGame = NewGameUseCase({
            gameRepository: gameSpy,
            scenarioRepository: mockRepository()
        });
        newGame({name: 'test', scenarioId: 'test'});
        expect(gameSpy.saveCalled).to.equal(1);
    });
});
