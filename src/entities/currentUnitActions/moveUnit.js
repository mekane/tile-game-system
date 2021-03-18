const util = require('../../util.js');

function moveUnit(state, {unitIndex, direction}, encounter) {
    if (typeof unitIndex !== 'number')
        throw new Error('Move Unit failed: missing unit index');

    if (typeof direction !== 'string')
        throw new Error('Move Unit failed: missing direction');

    const unitToMove = state.units[unitIndex];
    if (typeof unitToMove !== 'object')
        throw new Error(`Move Unit failed: could not find unit with index ${unitIndex}`);

    if (unitToMove.doneActivating)
        throw new Error(`Move Unit failed: unit is already done activating`);

    const unitX = unitToMove.positionX;
    const unitY = unitToMove.positionY;
    const {x, y} = util.adjustCoordinatesForDirection(unitX, unitY, direction);
    const tile = encounter.getBoard().getTileAt({x, y});

    if (tile === null)
        throw new Error('Move Unit failed: destination is out of bounds');

    state.units.forEach(unit => {
        if (unit.positionX === x && unit.positionY === y)
            throw new Error('Move Unit failed: destination is occupied');
    });

    const terrainDef = encounter.getBoard().getTerrainAt({x, y});

    if (terrainDef.blocksMovement)
        throw new Error('Move Unit failed: destination is blocked');

    if (unitToMove.movementRemaining < terrainDef.movementRequired)
        throw new Error('Move Unit failed: unit lacks sufficient movement points');

    unitToMove.hasActivated = true;
    unitToMove.movementRemaining -= terrainDef.movementRequired;
    unitToMove.positionX = x;
    unitToMove.positionY = y;
}

module.exports = moveUnit;