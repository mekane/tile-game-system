'use strict'
const expect = require('chai').expect;
const validUnit = require('../_fixtures').validUnit;

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

        const badUnitNoTiles = {
            name: 'Bad Unit No Tiles',
            terrain: {}
        }
        expect(Unit(badUnitNoTiles)).to.be.a('null');

        const badUnitNoTilesArrays = {
            name: 'Bad Unit No Items in Tiles',
            tiles: [],
            terrain: {}
        }
        expect(Unit(badUnitNoTilesArrays)).to.be.a('null');

        const badUnitNoTilesSubArrays = {
            name: 'Bad Unit No Items in Tiles Arrays',
            tiles: [
                [],
                [],
                []
            ],
            terrain: {}
        }
        expect(Unit(badUnitNoTilesSubArrays)).to.be.a('null');

        const badUnitBadContentInSubArrays = {
            name: 'Bad Unit Non-string Items in Tiles Arrays',
            tiles: [
                [1],
                [{}],
                [false]
            ],
            terrain: {}
        }
        expect(Unit(badUnitBadContentInSubArrays)).to.be.a('null');
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
});

