const expect = require('chai').expect;

const markUnitDone = require('../../../../engine/entities/encounterActions/markUnitDone.js');

describe('Encounter Action - MarkUnitDone', () => {
    it(`throws an error if no unit is specified`, () => {
        const messageMissingUnit = () => markUnitDone({}, {});
        expect(messageMissingUnit).to.throw(/Mark Unit Done Failed: missing unit index/);
    });

    it(`throws an error if the specified unit does not exist in the list of units`, () => {
        const unitNotFound = () => markUnitDone(initialEncounterState(), {unitIndex: 1});
        expect(unitNotFound).to.throw(/Mark Unit Done Failed: invalid unit/);
    });

    it(`throws an error if the unit was already done activating`, () => {
        const state = initialEncounterState();
        //TODO: this is inappropriate internal knowledge - find a better way to mark the unit done
        state.units[0].hasActivated = true;
        state.units[0].doneActivating = true;

        const unitAlreadyDone = () => markUnitDone(state, {unitIndex: 0});
        expect(unitAlreadyDone).to.throw(/Mark Unit Done Failed: unit is already done/);
    });

    it(`throws an error if the unit was already done activating`, () => {
        const state = initialEncounterState();
        const expectedEvent = {type: "UnitDone", unitIndex: 0};
        const actualEvent = markUnitDone(state, {unitIndex: 0});
        expect(actualEvent).to.deep.equal(expectedEvent);
    });
});


//TODO: remove duplication
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