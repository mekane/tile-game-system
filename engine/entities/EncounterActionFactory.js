const activateUnit = require('./encounterActions/activateUnit.js');
const addUnit = require('./encounterActions/addUnit.js');
const doneActivating = require('./encounterActions/markUnitDone.js');
const moveUnit = require('./encounterActions/moveUnit.js');

const actionByName = {
    activateunit: activateUnit,
    addunit: addUnit,
    markunitdone: doneActivating,
    moveunit: moveUnit
}

function EncounterActionFactory() {
    function getActionByName(actionName = '') {
        const name = typeof actionName === 'string' ? actionName.toLowerCase() : '';

        return actionByName[name];
    }

    return {
        getActionByName
    }
}

module.exports = EncounterActionFactory;