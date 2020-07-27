const h = require('snabbdom/h').default;

const block = 'unit-list'

function UnitListView(state) {
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
        const unitMovement = `Move: ${unit.movementRemaining} / ${unit.movementMax}`;

        const classes = ['li', 'unit-list__unit'];

        if (isActive)
            classes.push('active');

        const content = [
            h(`div.${block}__unit-name`, unit.name),
            h(`div.${block}__unit-details`, unitMovement)
        ];

        if (isActive) {
            content.push(h('button.done', 'Done')); //TODO: make this do something
        }

        if (!isActive && !unit.doneActivating) {
            content.push(h('button.activate', 'Activate')); //TODO: make this do something
        }

        return h(classes.join('.'), {}, content);
    }
}

module.exports = {
    UnitListView
}
