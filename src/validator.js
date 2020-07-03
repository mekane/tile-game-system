const BoardSchema = require('./schema/BoardAttributes.schema.json');
const CharacterSchema = require('./schema/CharacterAttributes.schema.json');
const EncounterSchema = require('./schema/EncounterAttributes.schema.json');
const GameSchema = require('./schema/GameAttributes.schema.json');
const ScenarioSchema = require('./schema/ScenarioAttributes.schema.json');
const UnitSchema = require('./schema/UnitAttributes.schema.json');

const schemaForType = {
    Board: BoardSchema,
    Character: CharacterSchema,
    Encounter: EncounterSchema,
    Game: GameSchema,
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

function validateAs(data, type) {
    const schema = schemaForType[type];

    if (!schema)
        return false;

    const result = schemaValidator.validate(data, schema);
    if (result.errors[0]) {
        console.error('Invalid attributes: ' + result.errors[0].stack);
        return false;
    }

    return true;
}

module.exports = {
    validateAs
}
