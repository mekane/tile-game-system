'use strict'
const expect = require('chai').expect;

const Encounter = require('../../src/entities/Encounter');

describe('The Encounter entity', () => {
    it(`exports a constructor function`, () => {
        expect(Encounter).to.be.a('function');
    });

    it(`expects an object of attributes, and returns null if not`, () => {
        expect(Encounter()).to.be.a('null');
        expect(Encounter(false)).to.be.a('null');
        expect(Encounter(0)).to.be.a('null');
        expect(Encounter('test')).to.be.a('null');
        expect(Encounter(['test'])).to.be.a('null');
    });

    it(`expects the object to conform to the EncounterAttributes schema and returns null if not`, () => {
        expect(Encounter({})).to.be.a('null');
        expect(Encounter({test: 'test'})).to.be.a('null');

        const badEncounterNoUnitDefs = {
            name: 'Bad Encounter No Unit Definitions',
            description: 'description',
            boardId: 'board_test_12345678'
        }
        expect(Encounter(badEncounterNoUnitDefs)).to.be.a('null');

        const badEncounterEmptyUnitDefs = {
            name: 'Bad Encounter Bad Unit Definitions',
            description: "description",
            boardId: 'board_test_12345678',
            unitDefinitions: []
        }
        expect(Encounter(badEncounterEmptyUnitDefs)).to.be.a('null');

        const badEncounterInvalidUnitDefs = {
            name: 'Bad Encounter Bad Unit Definitions',
            description: "description",
            boardId: 'board_test_12345678',
            unitDefinitions: [
                {
                    bogus: true
                }
            ]
        }
        expect(Encounter(badEncounterInvalidUnitDefs)).to.be.a('null');
    });

    it(`returns a Encounter object if the attributes are valid`, () => {
        expect(Encounter(validEncounter())).to.be.an('object');
    });

    it(`returns an immutable object`, () => {
        const newEncounter = Encounter(validEncounter());
        expect(_ => newEncounter.name = 'Test Mutation').to.throw(/Cannot add property/);
    });

    const validEncounterId = /^encounter_test_\d{6,8}/;

    it(`has an automatically generated ID`, () => {
        const newEncounter = Encounter(validEncounter());
        const newId = newEncounter.getId();
        expect(newId).to.be.a('string');
        const expectedMessage = `Expected ${newId} to match regex ${validEncounterId}`;
        const matchedRegex = validEncounterId.test(newId)
        expect(matchedRegex, expectedMessage).to.equal(true);
    });
});

function validEncounter() {
    return {
        name: 'Test',
        description: 'A cool encounter',
        boardId: 'board_test_12345678',
        unitDefinitions: [
            {
                name: "Unit One",
                movement: 3
            }
        ]
    }
}
