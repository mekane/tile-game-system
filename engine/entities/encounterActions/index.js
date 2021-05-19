const doneActivating = require('./markUnitDone.js');
const moveUnit = require('./moveUnit.js');

const activateUnit = require('./activateUnit.js');
const addUnit = require('./addUnit.js');


/**
 * @param actionName string
 * @return Function
 */
function currentUnitActionFactory(actionName) {
    let actionFunction = (state, options, encounter) => state;
    const name = actionName.toLowerCase();

    if (name === 'doneactivating')
        return wrapAction(doneActivating);
    else if (name === 'moveunit')
        return wrapAction(moveUnit)
    else if (name === 'activateunit')
        return wrapAction(activateUnit);
    else if (name === 'addunit')
        return wrapAction(addUnit);
}

function wrapAction(actionFunction) {
    /**
     * @param {Object} state
     * @param {Object} options
     * @param {Object} encounter
     */
    return function (state, options, encounter) {
        return actionFunction(state, options, encounter)
    }
}

module.exports = currentUnitActionFactory;
