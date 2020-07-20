const h = require('snabbdom/h').default;
const {cssSafeString} = require('../browserView/htmlHelpers');

function UnitView(unitData, unitNumber) {
    const unitName = cssSafeString(unitData.name).toLowerCase();
    const element = `div.unit.${unitName}`;
    return h(element, {}, `${unitData.name} ${unitNumber}`);
}

module.exports = {
    UnitView
}
