'use strict'
const expect = require('chai').expect;
const validEncounter = require('../_fixtures').validEncounter;
const validator = require('../../src/validator');

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

        const badEncounterNoUnitDefs = validEncounter();
        delete badEncounterNoUnitDefs.units;
        expect(Encounter(badEncounterNoUnitDefs)).to.be.a('null');

        const badEncounterEmptyUnitDefs = validEncounter();
        badEncounterEmptyUnitDefs.units = [];
        expect(Encounter(badEncounterEmptyUnitDefs)).to.be.a('null');

        const badEncounterInvalidUnitDefs = validEncounter()
        badEncounterInvalidUnitDefs.units = [{bogus: true}];
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

    it(`does not generate an id if one is present in the attributes`, () => {
        const idString = 'Existing ID';
        const encounterAttributes = validEncounter();
        encounterAttributes.id = idString;
        const newEncounter = Encounter(encounterAttributes);

        expect(newEncounter.getId()).to.equal(idString);
    });

    it(`has a getType function that returns the name of the entity type`, () => {
        const newEncounter = Encounter(validEncounter());
        expect(newEncounter.getType()).to.equal('Encounter');
    });

    it(`has a toJson method that returns the raw data for the Encounter`, () => {
        const newEncounter = Encounter(validEncounter());
        expect(validator.validateAs(newEncounter.toJson(), newEncounter.getType())).to.equal(true);
    });
});

