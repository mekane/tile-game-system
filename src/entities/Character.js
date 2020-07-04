'use strict'
const util = require('../util');
const validator = require('../validator');

const typeName = 'Character';

function Character(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('character', attributes.name);

    const {
        name,
        strength,
        dexterity,
        constitution,
        wisdom,
        intelligence,
        charisma
    } = attributes;

    function toJson() {
        return {
            id,
            name,
            strength,
            dexterity,
            constitution,
            wisdom,
            intelligence,
            charisma
        }
    }

    return Object.freeze({
        getId: _ => id,
        getType: _ => typeName,
        toJson
    });
}

module.exports = Character;
