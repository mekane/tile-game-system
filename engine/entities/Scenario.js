import {generateId} from '../util.js';
import {validateAs} from '../validator.js';

const Encounter = _ => _;

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
export function Scenario(attributes) {

    if (!validateAs(attributes, typeName))
        return null;

    const id = attributes.id || generateId('scenario', attributes.name);
    const name = attributes.name;
    const encounters = attributes.encounters.map(Encounter);

    if (encounters.some(e => e === null))
        console.log('Warning, one or more encounters were invalid', attributes.encounters);

    function toJson() {
        return {
            id,
            name,
            encounters
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
