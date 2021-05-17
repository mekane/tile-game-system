const expect = require('chai').expect;
const {gameDataWithMoreEncounterDetail, validGame} = require('../../../_fixtures.js');

const moveUnit = require('../../../../engine/entities/encounterActions/moveUnit.js');

const encounter = validGame().scenario.encounters[0];

describe('Encounter Action - MoveUnit', () => {
    it(`throws an error if no unit or direction is specified`, () => {
        const messageMissingUnit = () => moveUnit({}, {}, encounter);
        expect(messageMissingUnit).to.throw(/Move Unit failed: missing unit index/);

        const messageMissingDirection = () => moveUnit({}, {unitIndex: 0}, encounter);
        expect(messageMissingDirection).to.throw(/Move Unit failed: missing direction/);
    });

    it(`throws an error if the specified unit does not exist in the list of units`, () => {
        const unitNotFound = () => moveUnit(initialEncounterState(), {unitIndex: 1, direction: 'n'}, encounter);
        expect(unitNotFound).to.throw(/Move Unit failed: could not find unit with index/);
    });

    it(`throws an error if the unit is done`, () => {
        const state = initialEncounterState();
        //TODO: this is inappropriate internal knowledge - find a better way to mark the unit done
        state.units[0].hasActivated = true;
        state.units[0].doneActivating = true;

        const unitIsDone = () => moveUnit(state, {unitIndex: 0, direction: 'e'}, encounter);
        expect(unitIsDone).to.throw(/unit is already done activating/);
    });

    it(`throws an error if the specified direction is invalid`, () => {
        const unitNotFound = () => moveUnit(initialEncounterState(), {unitIndex: 0, direction: 'Foo'}, encounter);
        expect(unitNotFound).to.throw(/Move Unit failed: invalid move direction/);
    });

    it(`throws an error if the board location in the specified direction is invalid`, () => {
        const unitIndex = 0;

        const moveOffBoardY = () => moveUnit(initialEncounterState(), {unitIndex, direction: 'n'}, encounter);
        const moveOffBoardX = () => moveUnit(initialEncounterState(), {unitIndex, direction: 'w'}, encounter);
        const moveOffBoardD = () => moveUnit(initialEncounterState(), {unitIndex, direction: 'nw'}, encounter);

        expect(moveOffBoardY).to.throw(/Move Unit failed: destination is out of bounds/);
        expect(moveOffBoardX).to.throw(/Move Unit failed: destination is out of bounds/);
        expect(moveOffBoardD).to.throw(/Move Unit failed: destination is out of bounds/);
    });

    it(`throws an error if the specified board location already contains a unit`, () => {
        const state = initialEncounterState()
        state.units.push({
            definitionId: 'Unit_23',
            movementMax: 6,
            movementRemaining: 6,
            name: 'Goblin',
            positionX: 1,
            positionY: 0,
            turnOrder: 1
        }); //TODO: do this better, using an actual Game initial state and events

        const messageUnitConflict = () => moveUnit(state, {unitIndex: 0, direction: 'e'}, encounter);
        expect(messageUnitConflict).to.throw(/Move Unit failed: destination is occupied/);
    });

    it(`throws an error if the terrain of the destination tile blocks movement`, () => {
        const moveSouth = {unitIndex: 0, direction: 's'};
        let state = initialEncounterState();
        moveUnit(state, moveSouth, encounter)

        const movementBlocked = () => moveUnit(state, moveSouth, encounter);
        expect(movementBlocked).to.throw(/Move Unit failed: destination is blocked/);
    });

    //TODO: "success" test that returns a MoveUnit event


    it(`throws an error if the unit is out of movement`, () => {
        let state = initialEncounterState();
        const unitIndex = 0;

        //TODO: return new state instead of mutation
        moveUnit(state, {unitIndex, direction: 'e'}, encounter); //5 remaining
        moveUnit(state, {unitIndex, direction: 'w'}, encounter); //4
        moveUnit(state, {unitIndex, direction: 'e'}, encounter); //3
        moveUnit(state, {unitIndex, direction: 'w'}, encounter); //2
        moveUnit(state, {unitIndex, direction: 'e'}, encounter); //1
        moveUnit(state, {unitIndex, direction: 'w'}, encounter); //0 remaining

        const messageNoMove = () => moveUnit(state, {unitIndex: 0, direction: 'e'}, encounter);
        expect(messageNoMove).to.throw(/Move Unit failed: unit lacks sufficient movement points/);
    });

    it(`throws an error if the unit doesn't have enough movement`, () => {
        let state = initialEncounterState();
        const unitIndex = 0;

        moveUnit(state, {unitIndex, direction: 'e'}, encounter); //5 remaining
        moveUnit(state, {unitIndex, direction: 'w'}, encounter); //4
        moveUnit(state, {unitIndex, direction: 'e'}, encounter); //3
        moveUnit(state, {unitIndex, direction: 'w'}, encounter); //2
        moveUnit(state, {unitIndex, direction: 'e'}, encounter); //1 remaining

        const messageNoMove = () => moveUnit(state, {unitIndex: 0, direction: 'e'}, encounter);
        expect(messageNoMove).to.throw(/Move Unit failed: unit lacks sufficient movement points/);
    });

});

function initialEncounterState() {
    return {
        units: [
            {
                definitionId: 'Unit_23',
                movementMax: 6,
                movementRemaining: 6,
                name: 'Goblin',
                positionX: 0,
                positionY: 0,
                turnOrder: 1
            }
        ],
        unitsGroupedByTurnOrder: [[0]],
        activeGroup: 0,
        activeUnit: 0
    }
}