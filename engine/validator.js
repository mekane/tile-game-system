import BoardSchema from './schema/BoardAttributes.schema.json';
import EncounterSchema from './schema/EncounterAttributes.schema.json';
import GameSchema from './schema/GameAttributes.schema.json';
import GameActionSchema from './schema/GameAction.schema.json';
import ScenarioSchema from './schema/ScenarioAttributes.schema.json';
import UnitSchema from './schema/UnitAttributes.schema.json';

const schemaForType = {
    Board: BoardSchema,
    Encounter: EncounterSchema,
    Game: GameSchema,
    GameAction: GameActionSchema,
    Scenario: ScenarioSchema,
    Unit: UnitSchema
}
const types = Object.keys(schemaForType);

import jsonschema from 'jsonschema';

const schemaValidator = new jsonschema.Validator();

types.forEach(type => {
    const schema = schemaForType[type];
    const id = schema['$id'];
    schemaValidator.addSchema(schema, id);
});

export function validateAs(data, type, showMessages = false) {
    if (typeof data === 'undefined')
        return false;

    const schema = schemaForType[type];

    if (!schema) {
        if (showMessages)
            console.error(`Unknown schema type ${type}`);
        return false;
    }

    const result = schemaValidator.validate(data, schema);
    if (result.errors[0]) {
        if (showMessages)
            console.error('Invalid attributes: ' + result.errors[0].stack);
        return false;
    }

    return true;
}

