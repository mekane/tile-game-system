const util = require('../../util.js')
const Board = require('../Board.js')

function addUnit(state, {unitId, unitName, boardX, boardY}, encounter) {
    if (!unitId && !unitName)
        throw new Error('Add Unit failed: missing unit id or name');

    const unitDefs = encounter.units;

    let unitDefinition = false;

    const keys = Object.keys(unitDefs);
    for (let i = 0; i < keys.length; i++) {
        const unitDef = unitDefs[keys[i]];
        if (unitId === unitDef.id || unitDef.name === unitName) {
            unitDefinition = unitDef;
            break;
        }
    }

    if (typeof unitDefinition !== 'object') {
        if (unitId)
            throw new Error(`Add Unit failed: could not find unit with id ${unitId}`);
        else
            throw new Error(`Add Unit failed: could not find unit with name ${unitName}`);
    }

    if (typeof boardX === 'undefined' || typeof boardY === 'undefined')
        throw new Error('Add Unit failed: missing board coordinates');

    const board = Board(encounter.board)
    const {width, height} = board.getDimensions();

    if (boardX < 0 || boardX > width || boardY < 0 || boardY > height)
        throw new Error('Add Unit failed: board coordinates out of bounds');

    const terrainDef = board.getTerrainAt({x: boardX, y: boardY});
    if (terrainDef.blocksMovement)
        throw new Error('Add Unit failed: cannot add unit at specified coordinates');

    state.units.forEach(u => {
        if (u.positionX === boardX && u.positionY === boardY)
            throw new Error('Add Unit failed: cannot add unit at specified coordinates');
    });

    const unitTurnOrder = unitDefinition.turnOrder;

    const newUnit = {
        definitionId: unitDefinition.id,
        movementMax: unitDefinition.movement,
        movementRemaining: unitDefinition.movement,
        name: unitDefinition.name,
        positionX: boardX,
        positionY: boardY,
        turnOrder: typeof unitTurnOrder === 'number' ? unitTurnOrder : 99
    };
    state.units.push(newUnit);
    state.unitsGroupedByTurnOrder = util.groupUnitsByTurnOrder(state.units);

    if (state.activeGroup === null) {
        state.activeGroup = 0;
        state.activeUnit = 0;
    }

    //TODO: convert these to return a new state, not mutate the one passed in
}

module.exports = addUnit;