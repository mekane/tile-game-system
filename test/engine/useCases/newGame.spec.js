const expect = require('chai').expect;
const {mockRepository, spyRepository, inMemoryRepository} = require('../../_mocks.js');
const {validScenario} = require('../../_fixtures.js');

const {NewGame} = require('../../../engine/useCases/newGame.js');

const testScenario = validScenario();
const testScenarioID = 'Test_Scenario_ID';
testScenario.id = testScenarioID;
const testScenarioRepository = inMemoryRepository({[testScenarioID]: testScenario});

describe('The NewGame Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(NewGame).to.be.a('function');
    });

    it('returns a function from the initializer that calls the use case', () => {
        const newGame = NewGame({
            gameRepository: mockRepository(),
            scenarioRepository: mockRepository(),
        });
        expect(newGame).to.be.a('function');
    });
});

describe('The NewGame Use Case function', () => {
    it(`returns an error status if the scenario is not found by id`, async () => {
        const newGame = NewGame({
            gameRepository: mockRepository(),
            scenarioRepository: mockRepository()
        });
        const result = await newGame('test', 'bad_id');
        expect(result).to.deep.equal({
            success: false,
            error: `No Scenario found with id bad_id`
        });
    });

    it(`uses the ScenarioRepository to find the referenced scenario`, () => {
        const scenarioSpy = spyRepository();
        const newGame = NewGame({
            gameRepository: mockRepository(),
            scenarioRepository: scenarioSpy
        });
        newGame('test', 'test');
        expect(scenarioSpy.getCalled).to.equal(1);
    });

    it(`returns an OK status message if the game was created`, async () => {
        const newGame = NewGame({
            gameRepository: mockRepository(),
            scenarioRepository: testScenarioRepository
        });
        const result = await newGame('Test', testScenarioID);
        expect(result.success).to.equal(true);
        expect(result.created).to.be.a('string');
    });

    it(`puts the new Game instance into the Game repository`, async () => {
        const gameSpy = spyRepository();
        const newGame = NewGame({
            gameRepository: gameSpy,
            scenarioRepository: testScenarioRepository
        });
        await newGame('test', testScenarioID);
        expect(gameSpy.saveCalled).to.equal(1);
    });
});
