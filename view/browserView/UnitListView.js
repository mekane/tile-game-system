import {h} from 'snabbdom/h.js';

const block = 'unit-list'

export function UnitListView(state) {
    /*PROFILE*/
    window.profileGameView['UnitListView']++;

    const {units, activeUnit, activeGroup} = state;

    const header = h(`header.${block}__header`, 'Units');
    const list = makeUnitList(units);

    return h(`div.${block}`, {}, [header, list]);


    function makeUnitList(units) {
        return h(`ol.${block}__body`, {}, units.map(makeUnitListItem));
    }

    function makeUnitListItem(unit, unitIndex) {
        const isActive = (unitIndex === activeUnit);

        const classes = ['li', 'unit-list__unit'];

        if (isActive)
            classes.push('active');

        const unitMovement = h('div.unit-list__unit-move',`Move: ${unit.movementRemaining} / ${unit.movementMax}`);
        const unitDetails = [unitMovement]

        if (isActive) {
            const data = {
                on: {
                    'click': e => viewAction('unitDone', unitIndex)
                }
            }
            unitDetails.push(h('button.done', data, 'Done'));
        }

        if (!isActive && !unit.doneActivating) { //TODO: && "couldActivate" (is in activeGroup)
            const data = {
                on: {
                    'click': e => viewAction('activateUnit', unitIndex)
                }
            }
            unitDetails.push(h('button.activate', data, 'Activate'));
        }

        const content = [
            h(`div.${block}__unit-name`, `${unit.name} ${unitIndex}`),
            h(`div.${block}__unit-details`, unitDetails)
        ];

        return h(classes.join('.'), {}, content);
    }
}
