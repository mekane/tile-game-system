const expect = require('chai').expect;
const {mockRepository, spyRepository, inMemoryRepository} = require('../_mocks');
const {validGame} = require('../_fixtures');
const Game = require('../../src/entities/Game');

const validator = require('../../src/validator');
const StartEncounterUseCase = require('../../src/useCases/StartEncounter');

/*
describe('The StartEncounter Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(StartEncounterUseCase).to.be.a('function');
    });

    it('returns a constructor function from the initializer', () => {
        const StartEncounter = StartEncounterUseCase({
            gameRepository: mockRepository(),
            scenarioRepository: mockRepository(),
        });
        expect(StartEncounter).to.be.a('function');
    });
});

describe('The StartEncounter Use Case function', () => {
    it(`uses the ScenarioRepository to find the referenced scenario`, () => {
        const scenarioSpy = spyRepository();
        const StartEncounter = StartEncounterUseCase({
            gameRepository: mockRepository(),
            scenarioRepository: scenarioSpy
        });
        StartEncounter({name: 'test', scenarioId: 'test'});
        expect(scenarioSpy.getCalled).to.equal(1);
    });

    it(`fetches the Scenario from the repository by id`, async () => {
        const StartEncounter = StartEncounterUseCase({
            gameRepository: mockRepository(),
            scenarioRepository: testScenarioRepository
        });
        const game = await StartEncounter({name: 'test', scenarioId: testScenarioID});
        const scenario = game.getScenario();

        expect(scenario.getType()).to.equal('Scenario');
        expect(scenario.getId()).to.equal(testScenarioID);
    });

    it(`returns the new Game instance`, async () => {
        const StartEncounter = StartEncounterUseCase({
            gameRepository: mockRepository(),
            scenarioRepository: testScenarioRepository
        });
        const game = await StartEncounter({name: 'Test', scenarioId: testScenarioID});

        expect(game).to.be.an('object');
        expect(game.getId().startsWith('game_test_')).to.equal(true);
        expect(game.getType()).to.equal('Game');
        expect(validator.validateAs(game.toJson(), game.getType())).to.equal(true);
    });

    it(`puts the new Game instance into the Game repository`, () => {
        const gameSpy = spyRepository();
        const StartEncounter = StartEncounterUseCase({
            gameRepository: gameSpy,
            scenarioRepository: mockRepository()
        });
        StartEncounter({name: 'test', scenarioId: 'test'});
        expect(gameSpy.saveCalled).to.equal(1);
    });
});
*/
