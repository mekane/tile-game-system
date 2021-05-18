const expect = require('chai').expect;
const fixtures = require('../_fixtures.js');

const validator = require('../../engine/validator.js');

const types = [
    'Board',
    'Encounter',
    'Game',
    'GameEvent',
    'Scenario',
    'Unit'
];

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

    types.forEach(Type => {
        const validType = `valid${Type}`;
        const validTypeFn = fixtures[validType];
        const instance = validTypeFn();

        it(`returns true for valid ${Type} values`, () => {
            expect(validator.validateAs(instance, Type)).to.equal(true);
        });
    });
});
