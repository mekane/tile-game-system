'use strict'
const expect = require('chai').expect;
const {validEncounter, validEncounterWithInitialUnit} = require('../_fixtures');
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

    it(`returns an Encounter object if the attributes are valid`, () => {
        expect(Encounter(validEncounter())).to.be.an('object');
        expect(Encounter(validEncounterWithInitialUnit())).to.be.an('object');
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

    it(`has a getBoard method that returns the Board entity`, () => {
        const newEncounter = Encounter(validEncounter());
        const board = newEncounter.getBoard();

        expect(board.getType()).to.equal('Board');
    });

    it(`has a getInit method that returns a copy of the initial actions`, () => {
        const encounterData = validEncounterWithInitialUnit();
        const newEncounter = Encounter(encounterData);

        expect(newEncounter.getInit()).to.not.equal(encounterData.init);
        expect(newEncounter.getInit()[0]).to.not.equal(encounterData.init[0]);
        expect(newEncounter.getInit()).to.deep.equal(encounterData.init);
    });

    it(`has a getType function that returns the name of the entity type`, () => {
        const newEncounter = Encounter(validEncounter());
        expect(newEncounter.getType()).to.equal('Encounter');
    });

    it(`has a getUnits method that returns the Array of Unit entities`, () => {
        const newEncounter = Encounter(validEncounter());
        const units = newEncounter.getUnits();

        expect(units[0].getType()).to.equal('Unit');
    });

    it(`has a getUnitsById method that returns a map of units by their ids`, () => {
        const encounterData = validEncounter();
        encounterData.units[0].id = 'unit_test0_1234';
        encounterData.units[1].id = 'unit_test1_1234';
        const newEncounter = Encounter(encounterData);

        const actualUnitsById = newEncounter.getUnitsById();
        expect(actualUnitsById['unit_test0_1234'].toJson()).to.deep.equal(encounterData.units[0]);
        expect(actualUnitsById['unit_test1_1234'].toJson()).to.deep.equal(encounterData.units[1]);
    });

    it(`has a toJson method that returns the raw data for the Encounter`, () => {
        const originalEncounterData = validEncounter();
        originalEncounterData.board.id = 'board_test_1234';
        originalEncounterData.units[0].id = 'unit_test_1234';
        originalEncounterData.units[1].id = 'unit_test_1235';
        const newEncounter = Encounter(originalEncounterData);

        const json = newEncounter.toJson();
        expect(validator.validateAs(json, newEncounter.getType())).to.equal(true);
        expect(json.board).to.deep.equal(originalEncounterData.board);
        expect(json.units).to.deep.equal(originalEncounterData.units);
    });

    it(`returns copies from toJson, not original objects`, () => {
        const originalEncounterData = validEncounter();
        originalEncounterData.id = 'encounter_test_1234';

        const newEncounter = Encounter(originalEncounterData);
        const json = newEncounter.toJson();
        expect(json).to.not.equal(originalEncounterData);
        expect(json.board, 'Board JSON').to.not.equal(originalEncounterData.board);
        expect(json.units, 'Units JSON').to.not.equal(originalEncounterData.units);
    });

    it(`can re-create itself from the output of its toJson method`, () => {
        const originalData = validEncounterWithInitialUnit({id: 'test-id'});
        originalData.board.id = 'board_test_1234';
        originalData.units[0].id = 'unit_test_1234';
        originalData.units[1].id = 'unit_test_1235';
        const newEncounter = Encounter(originalData);

        const newData = newEncounter.toJson();
        expect(newData).to.deep.equal(originalData);

        const reconstructedEncounter = Encounter(newData);
        expect(reconstructedEncounter.toJson()).to.deep.equal(newData);
    });
});
