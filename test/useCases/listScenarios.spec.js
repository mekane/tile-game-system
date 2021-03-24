const expect = require('chai').expect;
const {mockRepository, inMemoryRepository} = require('../_mocks');
const {validScenario} = require('../_fixtures');

const {ListScenarios} = require('../../src/useCases/listScenarios');

describe('The ListScenarios Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(ListScenarios).to.be.a('function');
    });

    it('returns a function from the initializer that calls the use case', () => {
        const listScenarios = ListScenarios({scenarioRepository: mockRepository()});
        expect(listScenarios).to.be.a('function');
    });
});

describe('The ListScenarios Use Case function', () => {
    it(`returns an array of scenarios that exist in the repository`, async () => {
        const scenarioRepository = populatedScenarioRepository();
        const listScenarioUseCase = ListScenarios({scenarioRepository});
        const listOfScenarios = await listScenarioUseCase();

        expect(listOfScenarios).to.be.an('array').with.length(3);
        expect(listOfScenarios[0].id).to.equal('test_scenario_id0');
        expect(listOfScenarios[1].id).to.equal('test_scenario_id1');
        expect(listOfScenarios[2].id).to.equal('test_scenario_id2');
    });
});

function populatedScenarioRepository() {
    const testScenario0 = validScenario({id: 'test_scenario_id0'});
    const testScenario1 = validScenario({id: 'test_scenario_id1'});
    const testScenario2 = validScenario({id: 'test_scenario_id2'});

    const testScenarioRepository = inMemoryRepository({
        [testScenario0.id]: testScenario0,
        [testScenario1.id]: testScenario1,
        [testScenario2.id]: testScenario2
    });
    return testScenarioRepository
}
