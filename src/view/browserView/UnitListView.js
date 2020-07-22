const h = require('snabbdom/h').default;

const block = 'unit-list'

function UnitListView(units) {
    /*PROFILE*/window.profileGameView['UnitListView']++;

    const header = h(`header.${block}__header`, 'Units');
    const list = makeUnitList(units);

    return h(`div.${block}`, {}, [header, list]);
}

function makeUnitList(units) {
    return h(`ol.${block}__body`, {}, units.map(makeUnitListItem));
}

function makeUnitListItem(unit) {
    const unitMovement = `Move: ${unit.movementRemaining} / ${unit.movementMax}`;

    const content = [
        h(`div.${block}__unit-name`, unit.name),
        h(`div.${block}__unit-details`, unitMovement)
    ];
    return h('li.unit-list__unit', {}, content);
}

module.exports = {
    UnitListView
}
