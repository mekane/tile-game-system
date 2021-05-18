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
        const nameName = message.action.toLowerCase();
        const action = currentUnitActionFactory(nameName);

        //TODO: in the final code for this, account for possible []
        const event = action(state, message, getCurrentEncounter());
        sendEvent(event);
    }

    function sendEvent(message) {
        //TODO: validate events somehow
        //if (!validator.validateAs(message, 'GameAction'))
        //console.log('WARNING: invalid game event', message)
        //return false;

        return processEvent(message)
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

        const initialEvents = encounter.init || [];
        initialEvents.forEach(sendEvent);

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

    function processEvent(event = {}) {

        if (event.type === 'ActivateUnit') {
            const currentActiveUnit = state.units[state.activeUnit];
            if (currentActiveUnit && currentActiveUnit.hasActivated)
                currentActiveUnit.doneActivating = true; //TODO: add ability to disable this with an event option

            state.activeUnit = event.unitIndex;
        } else if (event.type === 'AddUnit') {
            state.units.push(event.unit);
            state.unitsGroupedByTurnOrder = util.groupUnitsByTurnOrder(state.units);

            if (state.activeGroup === null) {
                state.activeGroup = 0;
                state.activeUnit = 0;
            }
        } else if (event.type === 'MoveUnit') {
            const unitToMove = state.units[event.unitIndex];
            unitToMove.hasActivated = true;
            unitToMove.movementRemaining -= event.movementToSubtract;
            unitToMove.positionX = event.x;
            unitToMove.positionY = event.y;
        } else if (event.type === 'UnitDone') {
            const unitToMark = state.units[event.unitIndex];
            unitToMark.hasActivated = true;
            unitToMark.doneActivating = true;
            const currentGroup = state.unitsGroupedByTurnOrder[state.activeGroup];

            state.activeUnit = findNextUnitInGroup(currentGroup);

            if (typeof state.activeUnit === 'undefined') {
                state.activeGroup++;
                const nextGroup = state.unitsGroupedByTurnOrder[state.activeGroup];

                if (nextGroup)
                    state.activeUnit = nextGroup[0];
                else {
                    state.unitsGroupedByTurnOrder = util.groupUnitsByTurnOrder(state.units);
                    state.activeGroup = 0;
                    state.activeUnit = state.unitsGroupedByTurnOrder[0][0];
                    state.units.forEach(u => {
                        u.hasActivated = false;
                        u.doneActivating = false;
                        u.movementRemaining = u.movementMax;
                    });
                }
            }


            function findNextUnitInGroup(group) {
                for (let i = 0; i < group.length; i++) {
                    const unitIndex = group[i];
                    const unit = state.units[unitIndex];
                    if (!unit.doneActivating)
                        return unitIndex;
                }
            }
        } else {
            console.log('WARNING: unknown game event type ' + event.type)
            return false;
        }
    }
}

module.exports = Game;
