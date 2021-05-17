'use strict'
const util = require('../util.js');
const validator = require('../validator.js');

const Board = require('./Board.js');

const currentUnitActionFactory = require('./encounterActions');

const typeName = 'Game';

function Game(attributes) {
    if (!validator.validateAs(attributes, typeName, true))
        return null;

    const id = attributes.id || util.generateId('game', attributes.name);
    const name = attributes.name;
    const scenario = attributes.scenario;

    let currentEncounterIndex = attributes.currentEncounterIndex || 0;

    let state = attributes.currentState || initialEncounterState(scenario.encounters[currentEncounterIndex]);

    function getActiveUnit() {
        const activeUnit = state.units[state.activeUnit];
        return Object.assign({}, activeUnit);
    }

    function getCurrentEncounter() {
        return scenario.encounters[currentEncounterIndex];
    }

    function getState() {
        return state;
    }

    function initialEncounterState() {
        const newState = {
            units: [],
            unitsGroupedByTurnOrder: [],
            activeGroup: null,
            activeUnit: null
        };

        return newState;
    }

    function sendAction(message) {
        if (!validator.validateAs(message, 'GameAction'))
            throw new Error('Invalid action');

        const nameName = message.action.toLowerCase();
        const action = currentUnitActionFactory(nameName);

        return action(state, message, getCurrentEncounter());
    }

    function sendEvent(message) {
        return sendAction(message)
    }

    function startEncounter(encounterIndex) {
        if (typeof encounterIndex !== 'number')
            throw new Error('missing encounter number');

        const maxEncounterIndex = scenario.encounters.length;
        if (encounterIndex < 0 || encounterIndex > maxEncounterIndex)
            throw new Error('invalid encounter number');

        currentEncounterIndex = encounterIndex;
        const encounter = getCurrentEncounter();
        state = initialEncounterState();

        const initialActions = encounter.init || [];
        initialActions.forEach(sendAction);

        if (state.units.length) {
            state.activeGroup = 0;
            state.activeUnit = state.unitsGroupedByTurnOrder[0][0];
        }
    }

    function toJson() {
        return {
            id,
            name,
            scenario: scenario,
            currentEncounterIndex,
            currentState: state
        }
    }

    return Object.freeze({
        getId: () => id,
        getActiveUnit,
        getCurrentBoard: () => Board(getCurrentEncounter().board),
        getScenario: () => scenario,
        getState,
        getType: () => typeName,
        sendEvent,
        sendAction,
        startEncounter,
        toJson
    });
}

module.exports = Game;
