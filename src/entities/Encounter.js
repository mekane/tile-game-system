'use strict'
const util = require('../util');
const validator = require('../validator');

const Board = require('./Board');
const Unit = require('./Unit');

const typeName = 'Encounter';

/**
 * An Encounter is a single level or map or battle.
 * It is initialized with
 */
function Encounter(attributes) {

    if (!validator.validateAs(attributes, typeName))
        return null;

    const id = attributes.id || util.generateId('encounter', attributes.name);

    const {name, description} = attributes;
    const board = Board(attributes.board);
    const units = attributes.units.map(Unit);

    function toJson() {
        return {
            id,
            name,
            description,
            board: board.toJson(),
            units: units.map(u => u.toJson())
        }
    }

    return Object.freeze({
        getBoard: _ => board,
        getId: _ => id,
        getType: _ => typeName,
        getUnits: _ => units.slice(),
        toJson
    });
}

module.exports = Encounter;
