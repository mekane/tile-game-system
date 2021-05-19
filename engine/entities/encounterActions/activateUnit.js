function activateUnit(state, {unitIndex}) {
    if (typeof unitIndex !== 'number')
        throw new Error('Activate Unit failed: missing unit index');

    const unitToActivate = state.units[unitIndex];
    if (typeof unitToActivate !== 'object')
        throw new Error(`Activate Unit failed: could not find unit with index ${unitIndex}`);

    const currentActivationGroup = state.unitsGroupedByTurnOrder[state.activeGroup];
    if (currentActivationGroup.indexOf(unitIndex) < 0)
        throw new Error(`Activate Unit failed: unit cannot activate now`);

    if (unitToActivate.doneActivating)
        throw new Error(`Activate Unit failed: unit is already done activating`);

    return {type: 'ActivateUnit', unitIndex};
}

module.exports = activateUnit;