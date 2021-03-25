const BoardSchema = require('./schema/BoardAttributes.schema.json');
const EncounterSchema = require('./schema/EncounterAttributes.schema.json');
const GameSchema = require('./schema/GameAttributes.schema.json');
const GameActionSchema = require('./schema/GameAction.schema.json');
const ScenarioSchema = require('./schema/ScenarioAttributes.schema.json');
const UnitSchema = require('./schema/UnitAttributes.schema.json');

const schemaForType = {
    Board: BoardSchema,
    Encounter: EncounterSchema,
    Game: GameSchema,
    GameAction: GameActionSchema,
    Scenario: ScenarioSchema,
    Unit: UnitSchema
}
const types = Object.keys(schemaForType);

const Validator = require('jsonschema').Validator;
const schemaValidator = new Validator();

types.forEach(type => {
    const schema = schemaForType[type];
    const id = schema['$id'];
    schemaValidator.addSchema(schema, id);
});

function validateAs(data, type, showMessages = false) {
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

module.exports = {
    validateAs
}
