'use strict'
const util = require('../util');
const validator = require('../validator');

const Encounter = require('./Encounter');

const typeName = 'Scenario';

/**
 * This entity holds the definition of a Scenaio, which is a campaign or adventure
 * and consists of multiple encounters. It is meant to be used as a read-only reference
 * for the encounters not as a live object to hold state.
 *
 * The scenario editor should load the JSON of the entity and return it (including ID)
 * when modifications are made, which will update the entire entity and save
 * it to storage.
 *
 * Methods on this entity are convenience methods for retrieving information about
 * the terrain and tile layout.
 */
function Scenario(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('scenario', attributes.name);
    const name = attributes.name;
    const encounters = attributes.encounters.map(Encounter);

    function toJson() {
        return {
            id,
            name,
            encounters: encounters.map(e => e.toJson())
        }
    }

    return Object.freeze({
        getEncounter: index => encounters[index],
        getId: () => id,
        getNumberOfEncounters: () => encounters.length,
        getType: () => typeName,
        toJson
    });
}

module.exports = Scenario;
