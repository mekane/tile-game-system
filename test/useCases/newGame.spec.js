const expect = require('chai').expect;
const {validScenario} = require('../_fixtures');

const validator = require('../../src/validator');
const newGameInit = require('../../src/useCases/newGame');

const testScenario = validScenario();
const scenarioRepositorySpy = {
    getScenarioCalled: 0,
    getScenario: function() {
        this.getScenarioCalled++
    }
}
const mockScenarioRepository = {
    getScenario: id => id === 'scenario_id' ? testScenario : null
}

describe('The NewGame Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(newGameInit).to.be.a('function');
    });

    it('returns a constructor function from the initializer', () => {
        const NewGameUseCase = newGameInit({scenarioRepository: {}});
        expect(NewGameUseCase).to.be.a('function');
    });
});

describe('The NewGame Use Case Constructor', () => {
    it(`uses the ScenarioRepository to find the referenced scenario`, () => {
        const NewGameUseCase = newGameInit({scenarioRepository: scenarioRepositorySpy});
        NewGameUseCase({name: 'test', scenarioId: 'test'});
        expect(scenarioRepositorySpy.getScenarioCalled).to.equal(1);
    });

    it(`fetches the Scenario from the repository by id`, () => {
        const NewGameUseCase = newGameInit({scenarioRepository: mockScenarioRepository});
        const newGame = NewGameUseCase({name: 'test', scenarioId: 'scenario_id'});
        const scenario = newGame.getScenario();

        //TODO: use id (without override) and/or name to uniquely identify the scenario
        expect(scenario.getType()).to.equal('Scenario');
        //expect(scenario.toJson()).to.deep.equal(testScenario);
    });

    it(`returns a new Game instance`, () => {
        const NewGameUseCase = newGameInit({scenarioRepository: mockScenarioRepository});
        const newGame = NewGameUseCase({name: 'Test'});

        expect(newGame).to.be.an('object');
        expect(newGame.getId().startsWith('game_test_')).to.equal(true);
        expect(newGame.getType()).to.equal('Game');
        //expect(validator.validateAs(newGame.toJson(), newGame.getType())).to.equal(true);
    });
});
