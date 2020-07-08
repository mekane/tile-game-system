'use strict'
const expect = require('chai').expect;
const validUnit = require('../_fixtures').validUnit;
const validator = require('../../src/validator');

const Unit = require('../../src/entities/Unit');

describe('The Unit entity', () => {
    it(`exports a constructor function`, () => {
        expect(Unit).to.be.a('function');
    });

    it(`expects an object of attributes, and returns null if not`, () => {
        expect(Unit()).to.be.a('null');
        expect(Unit(false)).to.be.a('null');
        expect(Unit(0)).to.be.a('null');
        expect(Unit('test')).to.be.a('null');
        expect(Unit(['test'])).to.be.a('null');
    });

    it(`expects the object to conform to the UnitAttributes schema and returns null if not`, () => {
        expect(Unit({})).to.be.a('null');
        expect(Unit({test: 'test'})).to.be.a('null');
        expect(Unit({name: 'test'})).to.be.a('null');
    });

    it(`returns a Unit object if the attributes are valid`, () => {
        expect(Unit(validUnit())).to.be.an('object');
    });

    it(`returns an immutable object`, () => {
        const newUnit = Unit(validUnit());
        expect(_ => newUnit.name = 'Test Mutation').to.throw(/Cannot add property/);
    });

    const validUnitId = /^unit_test_\d{6,8}/;

    it(`has an automatically generated ID`, () => {
        const newUnit = Unit(validUnit());
        const newId = newUnit.getId();
        expect(newId).to.be.a('string');
        const expectedMessage = `Expected ${newId} to match regex ${validUnitId}`;
        const matchedRegex = validUnitId.test(newId)
        expect(matchedRegex, expectedMessage).to.equal(true);
    });

    it(`does not generate an id if one is present in the attributes`, () => {
        const idString = 'Existing ID';
        const unitAttributes = validUnit();
        unitAttributes.id = idString;
        const newUnit = Unit(unitAttributes);

        expect(newUnit.getId()).to.equal(idString);
    });

    it(`has a getName method that returns the unit's movement rate`, () => {
        const newUnit = Unit(validUnit());
        expect(newUnit.getMovement()).to.equal(6);
    });

    it(`has a getName method that returns the unit's name`, () => {
        const newUnit = Unit(validUnit());
        expect(newUnit.getName()).to.equal('Test');
    });

    it(`has a getType function that returns the name of the entity type`, () => {
        const newUnit = Unit(validUnit());
        expect(newUnit.getType()).to.equal('Unit');
    });

    it(`has a toJson method that returns the raw data for the Unit`, () => {
        const newUnit = Unit(validUnit());
        expect(validator.validateAs(newUnit.toJson(), newUnit.getType())).to.equal(true);
    });

    it(`returns copies from toJson, not original objects`, () => {
        const originalUnitData = validUnit();
        originalUnitData.id = 'unit_test_1234';

        const newUnit = Unit(originalUnitData);
        const json = newUnit.toJson();
        expect(json).to.not.equal(originalUnitData);
    });
});
