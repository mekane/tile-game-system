const defaultActionByName = require('./encounterActions/index.js').defaultActionByName;

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