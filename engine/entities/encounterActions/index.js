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
        actionFunction = doneActivating;
    else if (name === 'moveunit')
        actionFunction = moveUnit


    if (name === 'activateunit')
        actionFunction = activateUnit;
    else if (name === 'addunit')
        actionFunction = addUnit;

    /**
     * @param {Object} state
     * @param {Object} options
     * @param {Object} encounter
     */
    const actionResult = function (state, options, encounter) {
        return actionFunction(state, options, encounter)
    }

    return actionResult;
}

module.exports = currentUnitActionFactory;
