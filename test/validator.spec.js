const expect = require('chai').expect;
const {
    validBoard,
    validCharacter,
    validEncounter,
    validGame,
    validScenario,
    validUnit
} = require('./_fixtures');

const validator = require('../src/validator');

describe('The validator module', () => {
    it(`exports a validateAs method that takes an object and a type`, () => {
        expect(validator.validateAs).to.be.a('function');
    });

    it(`always returns false for undefined`, () => {
        let foo;
        expect(validator.validateAs(foo, 'Board')).to.equal(false);
    });

    it(`returns false for unknown types`, () => {
        expect(validator.validateAs({}, 'NeverHeardOfItNoWay')).to.equal(false);
    });

    it(`returns true for valid Board values`, () => {
        expect(validator.validateAs(validBoard(), 'Board')).to.equal(true);
    });

    it(`returns true for valid Character values`, () => {
        expect(validator.validateAs(validCharacter(), 'Character')).to.equal(true);
    });

    it(`returns true for valid Encounter values`, () => {
        expect(validator.validateAs(validEncounter(), 'Encounter')).to.equal(true);
    });

    it(`returns true for valid Game values`, () => {
        expect(validator.validateAs(validGame(), 'Game')).to.equal(true);
    });

    it(`returns true for valid Scenario values`, () => {
        expect(validator.validateAs(validScenario(), 'Scenario')).to.equal(true);
    });

    it(`returns true for valid Unit values`, () => {
        expect(validator.validateAs(validUnit(), 'Unit')).to.equal(true);
    });
});
