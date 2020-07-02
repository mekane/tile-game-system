'use strict'
const expect = require('chai').expect;

const Character = require('../../src/entities/Character');

describe('The Character entities module', () => {
    it(`exports a constructor function`, () => {
        expect(Character).to.be.a('function');
    });

    it(`expects an object of attributes, and returns null if not`, () => {
        expect(Character()).to.be.a('null');
        expect(Character(false)).to.be.a('null');
        expect(Character(0)).to.be.a('null');
        expect(Character('test')).to.be.a('null');
        expect(Character(['test'])).to.be.a('null');
    });

    it(`expects the object to conform to the CharacterAttributes schema and returns null if not`, () => {
        expect(Character({})).to.be.a('null');
        expect(Character({test: 'test'})).to.be.a('null');
    });

    it(`returns a Character object if the attributes are valid`, () => {
        expect(Character(validCharacter())).to.be.an('object');
    });

    it(`returns an immutable object`, () => {
        const newChar = Character(validCharacter());
        expect(_ => newChar.name = 'Test Mutation').to.throw(/Cannot add property/);
    });

    const validCharacterId = /^character_test_character_\d{8}/;

    it(`has an automatically generated ID`, () => {
        const newChar = Character(validCharacter());
        const newId = newChar.getId();
        expect(newId).to.be.a('string');
        const expectedMessage = `Expected ${newId} to match regex ${validCharacterId}`;
        const matchedRegex = validCharacterId.test(newId)
        expect(matchedRegex, expectedMessage).to.equal(true);
    });
});

function validCharacter() {
    return {
        name: 'Test Character',
        strength: 12,
        dexterity: 9,
        constitution: 3,
        wisdom: 1,
        intelligence: 19,
        charisma: 16
    }
}
