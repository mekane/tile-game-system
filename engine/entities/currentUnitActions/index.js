import {doneActivating} from './doneActivating.js';
import {moveUnit} from './moveUnit.js';

import {activateUnit} from '../gameActions/activateUnit.js';
import {addUnit} from '../gameActions/addUnit.js';


/**
 * @param actionName string
 * @return Function
 */
export function currentUnitActionFactory(actionName) {
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
