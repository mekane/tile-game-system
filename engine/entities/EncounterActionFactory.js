const activateUnit = require('./encounterActions/activateUnit.js');
const addUnit = require('./encounterActions/addUnit.js');
const doneActivating = require('./encounterActions/markUnitDone.js');
const moveUnit = require('./encounterActions/moveUnit.js');

const defaultActionByName = {
    activateunit: activateUnit,
    addunit: addUnit,
    markunitdone: doneActivating,
    moveunit: moveUnit
}

function EncounterActionFactory(additionalActionMap = {}) {

    const actionByName = Object.assign({}, defaultActionByName)

    Object.keys(additionalActionMap).forEach(actionName => {
        const actionFunction = additionalActionMap[actionName];
        if (typeof actionFunction === 'function')
            actionByName[actionName.toLowerCase()] = actionFunction
    })

    function getActionByName(actionName = '') {
        const name = typeof actionName === 'string' ? actionName.toLowerCase() : '';

        return actionByName[name];
    }

    return {
        getActionByName
    }
}

module.exports = EncounterActionFactory;