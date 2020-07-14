const expect = require('chai').expect;
const {mockRepository, inMemoryRepository} = require('../_mocks');
const {validScenario} = require('../_fixtures');

const ListScenariosUseCase = require('../../src/useCases/listScenarios');

describe('The ListScenarios Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(ListScenariosUseCase).to.be.a('function');
    });

    it('returns a function from the initializer that calls the use case', () => {
        const listScenarios = ListScenariosUseCase({scenarioRepository: mockRepository()});
        expect(listScenarios).to.be.a('function');
    });
});

describe('The ListScenarios Use Case function', () => {
    it(`returns an array of scenarios that exist in the repository`, async () => {
        const scenarioRepository = populatedScenarioRepository();
        const listScenarioUseCase = ListScenariosUseCase({scenarioRepository});
        const listOfScenarios = await listScenarioUseCase();

        expect(listOfScenarios).to.be.an('array').with.length(3);
        expect(listOfScenarios[0].getId()).to.equal('test_scenario_id0');
        expect(listOfScenarios[0].getType()).to.equal('Scenario');
        expect(listOfScenarios[1].getId()).to.equal('test_scenario_id1');
        expect(listOfScenarios[1].getType()).to.equal('Scenario');
        expect(listOfScenarios[2].getId()).to.equal('test_scenario_id2');
        expect(listOfScenarios[2].getType()).to.equal('Scenario');
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