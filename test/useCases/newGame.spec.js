const expect = require('chai').expect;
const {validScenario} = require('../_fixtures');

const validator = require('../../src/validator');
const NewGameUseCase = require('../../src/useCases/newGame');

const mockGameRepository = {
    getGame: () => null,
    putGame: () => null
}

const testScenario = validScenario();
testScenario.id = 'Test_Scenario_ID'
const mockScenarioRepository = {
    getScenario: id => id === 'scenario_id' ? testScenario : null
}

function gameRepositorySpy() {
    return {
        getCalled: 0,
        putCalled: 0,
        getGame: function() {
            this.getCalled++
        },
        putGame: function() {
            this.putCalled++
        }
    }
}

function scenarioRepositorySpy() {
    return {
        getScenarioCalled: 0,
        getScenario: function() {
            this.getScenarioCalled++
        }
    }
}

describe('The NewGame Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(NewGameUseCase).to.be.a('function');
    });

    it('returns a constructor function from the initializer', () => {
        const newGame = NewGameUseCase({
            gameRepository: {},
            scenarioRepository: {},
        });
        expect(newGame).to.be.a('function');
    });
});

describe('The NewGame Use Case function', () => {
    it(`uses the ScenarioRepository to find the referenced scenario`, () => {
        const scenarioSpy = scenarioRepositorySpy();
        const newGame = NewGameUseCase({
            gameRepository: mockGameRepository,
            scenarioRepository: scenarioSpy
        });
        newGame({name: 'test', scenarioId: 'test'});
        expect(scenarioSpy.getScenarioCalled).to.equal(1);
    });

    it(`fetches the Scenario from the repository by id`, async () => {
        const newGame = NewGameUseCase({
            gameRepository: mockGameRepository,
            scenarioRepository: mockScenarioRepository
        });
        const game = await newGame({name: 'test', scenarioId: 'scenario_id'});
        const scenario = game.getScenario();

        expect(scenario.getType()).to.equal('Scenario');
        expect(scenario.getId()).to.equal('Test_Scenario_ID');
    });

    it(`returns the new Game instance`, async () => {
        const newGame = NewGameUseCase({
            gameRepository: mockGameRepository,
            scenarioRepository: mockScenarioRepository
        });
        const game = await newGame({name: 'Test', scenarioId: 'scenario_id'});

        expect(game).to.be.an('object');
        expect(game.getId().startsWith('game_test_')).to.equal(true);
        expect(game.getType()).to.equal('Game');
        expect(validator.validateAs(game.toJson(), game.getType())).to.equal(true);
    });

    it(`puts the new Game instance into the Game repository`, () => {
        const gameSpy = gameRepositorySpy();
        const newGame = NewGameUseCase({
            gameRepository: gameSpy,
            scenarioRepository: mockScenarioRepository
        });
        newGame({name: 'test', scenarioId: 'test'});
        expect(gameSpy.putCalled).to.equal(1);
    });
});
