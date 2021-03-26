import {Board} from './Board.js';
import {currentUnitActionFactory} from './currentUnitActions/index.js';
import {generateId} from '../util.js';
import {validateAs} from '../validator.js';

const typeName = 'Game';

export function Game(attributes) {
    if (!validateAs(attributes, typeName, true))
        return null;

    const id = attributes.id || generateId('game', attributes.name);
    const name = attributes.name;
    const scenario = attributes.scenario;

    let currentEncounterIndex = attributes.currentEncounterIndex || 0;

    let state = attributes.currentState || initializeStateForEncounter(scenario.encounters[currentEncounterIndex]);

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

    function initializeStateForEncounter(currentEncounter) {

        const newState = {
            units: [],
            unitsGroupedByTurnOrder: [],
            activeGroup: null,
            activeUnit: null
        };

        return newState;
    }

    function sendAction(message) {
        if (!validateAs(message, 'GameAction'))
            throw new Error('Invalid action');

        const nameName = message.action.toLowerCase();
        const action = currentUnitActionFactory(nameName);

        return action(state, message, getCurrentEncounter());
    }

    function startEncounter(encounterIndex) {
        if (typeof encounterIndex !== 'number')
            throw new Error('missing encounter number');

        const maxEncounterIndex = scenario.encounters.length;
        if (encounterIndex < 0 || encounterIndex > maxEncounterIndex)
            throw new Error('invalid encounter number');

        currentEncounterIndex = encounterIndex;
        const encounter = getCurrentEncounter();
        state = initializeStateForEncounter(encounter);

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
        getId: _ => id,
        getActiveUnit,
        getCurrentBoard: () => Board(getCurrentEncounter().board),
        getScenario: () => scenario,
        getState,
        getType: () => typeName,
        sendAction,
        startEncounter,
        toJson
    });
}
