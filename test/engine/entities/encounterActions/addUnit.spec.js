const expect = require('chai').expect;
const {gameDataWithMoreEncounterDetail, validGame} = require('../../../_fixtures.js');

const addUnit = require('../../../../engine/entities/encounterActions/addUnit.js');

const encounter = validGame().scenario.encounters[0];


describe('Encounter Action - AddUnit', () => {
    it(`throws an error if no unit is specified`, () => {
        const messageMissingUnit = () => addUnit({}, {}, encounter);
        expect(messageMissingUnit).to.throw(/Add Unit failed: missing unit id/);
    });

    it(`throws an error if the specified unit does not exist in the list of units`, () => {
        const unitNotFound = () => addUnit({}, {unitId: "bogus", boardX: 0, boardY: 0}, encounter);
        expect(unitNotFound).to.throw(/Add Unit failed: could not find unit with id/);
    });

    it(`throws an error if the specified board location is invalid`, () => {
        const unitId = encounter.units[0].id;

        const messageMissingBoard = () => addUnit({}, {action: "addUnit", unitId}, encounter);
        const badBoardXmin = () => addUnit({}, {unitId, boardX: -1, boardY: 0}, encounter);
        const badBoardXmax = () => addUnit({}, {unitId, boardX: 999, boardY: 0}, encounter);
        const badBoardYmin = () => addUnit({}, {unitId, boardX: 0, boardY: -1}, encounter);
        const badBoardYmax = () => addUnit({}, {unitId, boardX: 0, boardY: 999}, encounter);

        expect(messageMissingBoard).to.throw(/Add Unit failed: missing board coordinates/);
        expect(badBoardXmin).to.throw(/Add Unit failed: board coordinates out of bounds/);
        expect(badBoardXmax).to.throw(/Add Unit failed: board coordinates out of bounds/);
        expect(badBoardYmin).to.throw(/Add Unit failed: board coordinates out of bounds/);
        expect(badBoardYmax).to.throw(/Add Unit failed: board coordinates out of bounds/);
    });

    it(`throws an error if the terrain at the specified location blocks movement`, () => {
        const encounter = gameDataWithMoreEncounterDetail().scenario.encounters[1];
        const unitToAdd = encounter.units[0];

        const addUnitToBlockedSpaceAction = {action: 'addUnit', unitId: unitToAdd.id, boardX: 0, boardY: 0};
        const messageUnitConflict = () => addUnit({}, addUnitToBlockedSpaceAction, encounter);
        expect(messageUnitConflict).to.throw(/Add Unit failed: cannot add unit at specified coordinates/);
    });

    it(`throws an error if the specified board location already contains a unit`, () => {
        const state = blankEncounterState();
        const addUnitAction = {unitId: encounter.units[0].id, boardX: 0, boardY: 0};
        addUnit(state, addUnitAction, encounter);

        const messageUnitConflict = () => addUnit(state, addUnitAction, encounter);
        expect(messageUnitConflict).to.throw(/Add Unit failed: cannot add unit at specified coordinates/);
    });

    //TODO: add basic "success" test that asserts it returns an 'ADD UNIT' Event for a valid unit Id

    //TODO: make this assert the correct event returned
    //NOTE: this decouples the specifier (id vs. name) from the result of what actually happened.
    // So we still need two unit tests for id and for name, but only one for the AddUnit event because
    // it will have all the detail it needs
    it.skip(`can add a unit by name`, () => {
        //TODO: make this as specific as possible
        const expectedEvent = {
            eventType: 'AddUnit', boardX: 0, boardY: 0, unit: {
                name: 'Goblin'
            }
        };

        const actualEvent = addUnit(blankEncounterState(), {unitName: 'Goblin', boardX: 0, boardY: 0}, encounter);

        expect(actualEvent).to.deep.equal(expectedEvent);
    });

    it(`throws an error if there is no unit with the given name`, () => {
        const unitNotFound = () => addUnit(blankEncounterState(), {unitName: "bogus"}, encounter);
        expect(unitNotFound).to.throw(/Add Unit failed: could not find unit with name/);
    });

})

//TODO: this probably knows too much about the internal Game state - can we fix this?
function blankEncounterState() {
    return {
        units: []
    }
}