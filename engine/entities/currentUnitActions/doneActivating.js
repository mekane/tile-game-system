const util = require('../../util.js');

function doneActivating(state, {unitIndex}) {
    if (typeof unitIndex !== 'number')
        throw new Error('missing unit index');

    const unitToMark = state.units[unitIndex];
    if (typeof unitToMark !== 'object')
        throw new Error(`could not find unit with index ${unitIndex}`);

    if (unitToMark.doneActivating)
        throw new Error(`unit at index ${unitIndex} is already done`);

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
}

module.exports = doneActivating;