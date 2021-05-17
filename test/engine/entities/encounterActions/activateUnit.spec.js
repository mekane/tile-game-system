const expect = require('chai').expect;

const activateUnit = require('../../../../engine/entities/encounterActions/activateUnit.js');

describe('Encounter Action - ActivateUnit', () => {
    //ACTION
    it(`throws an error if no unit is specified`, () => {
        const messageMissingUnit = () => activateUnit({}, {});
        expect(messageMissingUnit).to.throw(/Activate Unit failed: missing unit index/);
    });

    //ACTION
    it(`throws an error if the specified unit does not exist in the list of units`, () => {
        const unitNotFound = () => activateUnit(initialEncounterState(), {unitIndex: 1});
        expect(unitNotFound).to.throw(/Activate Unit failed: could not find unit with index/);
    });

    //ACTION
    it(`throws an error if the unit is not in the current activation group`, () => {
        const multiUnitState = {
            units: [
                {
                    definitionId: 'm1',
                    movementMax: 4,
                    movementRemaining: 4,
                    name: 'Marine',
                    positionX: 1,
                    positionY: 1,
                    turnOrder: 1
                },
                {
                    definitionId: 'a1',
                    movementMax: 6,
                    movementRemaining: 6,
                    name: 'Alien',
                    positionX: 2,
                    positionY: 2,
                    turnOrder: 3
                }
            ],
            unitsGroupedByTurnOrder: [[0], [1]],
            activeGroup: 0,
            activeUnit: 0
        }; //TODO: would prefer to set this up using calls rather than hard-coding (too fragile)

        const unitNotEligible = () => activateUnit(multiUnitState, {unitIndex: 1});
        expect(unitNotEligible).to.throw(/Activate Unit failed: unit cannot activate now/);
    });

    //ACTION
    it(`throws an error if the unit is done`, () => {
        const state = initialEncounterState();
        //TODO: this is inappropriate internal knowledge - find a better way to mark the unit done
        state.units[0].hasActivated = true;
        state.units[0].doneActivating = true;

        const unitIsDone = () => activateUnit(state, {unitIndex: 0});
        expect(unitIsDone).to.throw(/Activate Unit failed: unit is already done activating/);
    });

    //ACTION
    //TODO: "success" test that returns an ActivateUnit Event

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