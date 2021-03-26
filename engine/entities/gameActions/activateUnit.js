export function activateUnit(state, {unitIndex}) {
    if (typeof unitIndex !== 'number')
        throw new Error('missing unit index');

    const unitToActivate = state.units[unitIndex];
    if (typeof unitToActivate !== 'object')
        throw new Error(`could not find unit with index ${unitIndex}`);

    const currentActivationGroup = state.unitsGroupedByTurnOrder[state.activeGroup];
    if (currentActivationGroup.indexOf(unitIndex) < 0)
        throw new Error(`unit at index ${unitIndex} cannot activate now`);

    if (unitToActivate.doneActivating)
        throw new Error(`unit at index ${unitIndex} is already done`);

    const currentActiveUnit = state.units[state.activeUnit];
    if (currentActiveUnit && currentActiveUnit.hasActivated)
        currentActiveUnit.doneActivating = true;

    state.activeUnit = unitIndex;
}
