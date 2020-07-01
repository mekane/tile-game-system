const expect = require('chai').expect;

const Character = require('../src/core/Character');

describe('The Character core module', () => {
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

    const validCharacterId = /^character_Test_Character_\d{8}/;

    it(`has an automatically generated ID property`, () => {
        const newChar = Character(validCharacter());
        expect(newChar.id).to.be.a('string');
        expect(validCharacterId.test(newChar.id)).to.equal(true);
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
