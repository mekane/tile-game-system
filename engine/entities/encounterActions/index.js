/**
 * This index exists to gather all of the default / built-in actions
 * and export them as a single collection (defaultActionByName) as
 * well as Enum-style consts for the action names.
 */

const activateUnit = require('./activateUnit.js');
const addUnit = require('./addUnit.js');
const doneActivating = require('./markUnitDone.js');
const moveUnit = require('./moveUnit.js');

const ACTIVATE_UNIT = 'activateunit';
const ADD_UNIT = 'addunit';
const MARK_UNIT_DONE = 'markunitdone';
const MOVE_UNIT = 'moveunit';

const defaultActionByName = {
    [ACTIVATE_UNIT]: activateUnit,
    [ADD_UNIT]: addUnit,
    [MARK_UNIT_DONE]: doneActivating,
    [MOVE_UNIT]: moveUnit
}

module.exports = {
    ACTIVATE_UNIT,
    ADD_UNIT,
    defaultActionByName,
    MARK_UNIT_DONE,
    MOVE_UNIT
}
