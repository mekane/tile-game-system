'use strict'
const util = require('../util');
const validator = require('../validator');

const Board = require('./Board');
const Unit = require('./Unit');

const typeName = 'Encounter';

/**
 * @typedef {object} EncounterAttributes
 * @property {string} [id]
 * @property {string} name
 * @property {string} description
 * @property {object} board
 * @property {array} units
 * @property {array} init
 */

/**
 * An Encounter is a single level or map or battle.
 * It is initialized with attributes that must conform to
 * the EncounterAttributes JSON schema
 * @type {EncounterAttributes}
 */
function Encounter(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('encounter', attributes.name);

    const {name, description} = attributes;
    const board = Board(attributes.board);
    const units = attributes.units.map(Unit);
    const init = attributes.init || [];

    function getUnitsById() {
        const unitsById = {};
        units.forEach(u => unitsById[u.getId()] = u);
        return unitsById;
    }

    function toJson() {
        return {
            id,
            name,
            description,
            board: board.toJson(),
            units: units.map(u => u.toJson()),
            init
        }
    }

    return Object.freeze({
        getBoard: _ => board,
        getId: _ => id,
        getInit: () => init.map(i => Object.assign({}, i)),
        getType: _ => typeName,
        getUnits: _ => units.slice(),
        getUnitsById,
        toJson
    });
}

module.exports = Encounter;
