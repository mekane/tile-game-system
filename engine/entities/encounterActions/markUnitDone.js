const util = require('../../util.js');

function markUnitDone(state, {unitIndex}) {
    if (typeof unitIndex !== 'number')
        throw new Error('Mark Unit Done Failed: missing unit index');

    const unitToMark = state.units[unitIndex];
    if (typeof unitToMark !== 'object')
        throw new Error(`Mark Unit Done Failed: invalid unit`);

    if (unitToMark.doneActivating)
        throw new Error(`Mark Unit Done Failed: unit is already done`);

    return {type: "UnitDone", unitIndex};
}

module.exports = markUnitDone;