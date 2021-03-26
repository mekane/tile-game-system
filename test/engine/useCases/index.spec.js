import chai from 'chai';

const expect = chai.expect;

import {mockRepository} from '../../_mocks.js';

import {init} from '../../../engine/useCases/index.js';

describe('The Use Case Module Index', () => {
    it(`exports a single init method that takes the repositories to inject`, () => {
        expect(init).to.be.a('function');
    });

    it(`throws an error if any of the repositories are missing`, () => {
        const gameRepository = mockRepository();
        const scenarioRepository = mockRepository();
        const missingGameRepo = _ => init({scenarioRepository});
        const missingScenarioRepo = _ => init({gameRepository});

        expect(missingGameRepo).to.throw(/Error initializing Controller: missing repository/);
        expect(missingScenarioRepo).to.throw(/Error initializing Controller: missing repository/);
    });

    it(`returns an object that exposes all of the initialized use cases`, () => {
        const gameRepository = mockRepository();
        const scenarioRepository = mockRepository();

        const useCases = init({gameRepository, scenarioRepository});
        expect(useCases).to.be.an('object');
        expect(useCases.gameAction).to.be.a('function');
        expect(useCases.gameState).to.be.a('function');
        expect(useCases.listScenarios).to.be.a('function');
        expect(useCases.newGame).to.be.a('function');
        expect(useCases.saveScenario).to.be.a('function');
        expect(useCases.startEncounter).to.be.a('function');
    });
});
