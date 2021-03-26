import chai from 'chai';

const expect = chai.expect;

import {validBoard, validEncounter, validGame, validGameAction, validScenario, validUnit} from '../_fixtures.js';
import {validateAs} from '../../engine/validator.js';

describe('The validator module', () => {
    it(`exports a validateAs method that takes an object and a type`, () => {
        expect(validateAs).to.be.a('function');
    });

    it(`always returns false for undefined`, () => {
        let foo;
        expect(validateAs(foo, 'Board')).to.equal(false);
    });

    it(`returns false for unknown types`, () => {
        expect(validateAs({}, 'NeverHeardOfItNoWay')).to.equal(false);
    });

    it(`returns true for valid values`, () => {
        expect(validateAs(validBoard(), 'Board')).to.equal(true);
        expect(validateAs(validEncounter(), 'Encounter')).to.equal(true);
        expect(validateAs(validGame(), 'Game')).to.equal(true);
        expect(validateAs(validGameAction(), 'GameAction')).to.equal(true);
        expect(validateAs(validScenario(), 'Scenario')).to.equal(true);
        expect(validateAs(validUnit(), 'Unit')).to.equal(true);
    });
});
