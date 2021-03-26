import chai from 'chai';

const expect = chai.expect;

import {mockRepository, inMemoryRepository} from '../../_mocks.js';
import {SaveScenario} from '../../../engine/useCases/saveScenario.js';
import {validScenario} from '../../_fixtures.js';

describe('The SaveScenario Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(SaveScenario).to.be.a('function');
    });

    it('returns a function from the initializer that calls the use case', () => {
        const saveScenario = SaveScenario({scenarioRepository: mockRepository()});
        expect(saveScenario).to.be.a('function');
    });
});

describe('The SaveScenario Use Case function', () => {
    const testId = 'MY_TEST_ID';

    it(`stores the Scenario data in the repository`, () => {
        const scenarioRepository = inMemoryRepository();
        const saveScenario = SaveScenario({scenarioRepository});
        const scenarioData = validScenario();
        scenarioData.id = testId;
        saveScenario(scenarioData);

        const scenario = scenarioRepository.getById(testId);
        expect(scenario).to.deep.equal(scenarioData);
    });

    it(`returns an OK message and the new id if this was a new scenario`, async () => {
        const saveScenario = SaveScenario({scenarioRepository: inMemoryRepository()});
        const scenarioData = validScenario();

        const result = await saveScenario(scenarioData);
        expect(result.success).to.equal(true);
        expect(result.scenarioId).to.be.a('string');
    });

    it(`returns an OK message and the existing id if this was not a new scenario`, async () => {
        const saveScenario = SaveScenario({scenarioRepository: inMemoryRepository()});
        const scenarioData = validScenario();
        scenarioData.id = testId;

        const result = await saveScenario(scenarioData);
        expect(result).to.deep.equal({success: true, scenarioId: testId});
    });
});
