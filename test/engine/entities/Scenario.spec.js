'use strict'
const expect = require('chai').expect;
const validScenario = require('../../_fixtures.js').validScenario;
const validator = require('../../../engine/validator.js');

const Scenario = require('../../../engine/entities/Scenario.js');

describe('The Scenario entity', () => {
    it(`exports a constructor function`, () => {
        expect(Scenario).to.be.a('function');
    });

    it(`expects an object of attributes, and returns null if not`, () => {
        expect(Scenario()).to.be.a('null');
        expect(Scenario(false)).to.be.a('null');
        expect(Scenario(0)).to.be.a('null');
        expect(Scenario('test')).to.be.a('null');
        expect(Scenario(['test'])).to.be.a('null');
    });

    it(`expects the object to conform to the ScenarioAttributes schema and returns null if not`, () => {
        expect(Scenario({})).to.be.a('null');
        expect(Scenario({test: 'test'})).to.be.a('null');

        const badScenarioBadContentInSubArrays = {
            name: 'Bad Scenario Non-string Items in Tiles Arrays',
            tiles: [
                [1],
                [{}],
                [false]
            ],
            terrain: {}
        }
        expect(Scenario(badScenarioBadContentInSubArrays)).to.be.a('null');
    });

    it(`returns a Scenario object if the attributes are valid`, () => {
        expect(Scenario(validScenario())).to.be.an('object');
    });

    it(`returns an immutable object`, () => {
        const newScenario = Scenario(validScenario());
        expect(_ => newScenario.name = 'Test Mutation').to.throw(/Cannot add property/);
    });

    const validScenarioId = /^scenario_test_\d{6,8}/;

    it(`has an automatically generated ID`, () => {
        const newScenario = Scenario(validScenario());
        const newId = newScenario.getId();
        expect(newId).to.be.a('string');
        const expectedMessage = `Expected ${newId} to match regex ${validScenarioId}`;
        const matchedRegex = validScenarioId.test(newId)
        expect(matchedRegex, expectedMessage).to.equal(true);
    });

    it(`does not generate an id if one is present in the attributes`, () => {
        const idString = 'Existing ID';
        const scenarioAttributes = validScenario();
        scenarioAttributes.id = idString;
        const newScenario = Scenario(scenarioAttributes);

        expect(newScenario.getId()).to.equal(idString);
    });


    it(`has a getNumberOfEncounters method that returns the number of encounters in the scenario`, () => {
        const newScenario = Scenario(validScenario());
        expect(newScenario.getNumberOfEncounters()).to.equal(2);
    });

    it(`has a getType function that returns the name of the entity type`, () => {
        const newScenario = Scenario(validScenario());
        expect(newScenario.getType()).to.equal('Scenario');
    });

    it(`has a toJson method that returns the raw data for the Scenario`, () => {
        const newScenario = Scenario(validScenario());
        expect(validator.validateAs(newScenario.toJson(), newScenario.getType())).to.equal(true);
    });
});
