const h = require('snabbdom/h').default;
const {cssSafeString} = require('../browserView/htmlHelpers');

function UnitView(unitData, unitNumber, TILE_SIZE, lastMoveDirection) {
    /*PROFILE*/
    window.profileGameView['UnitView']++;

    const unitName = cssSafeString(unitData.name).toLowerCase();
    const element = `div.unit.${unitName}`;
    const viewData = {
        style: {
            transform: getTransformForDirection(lastMoveDirection),
            transition: `transform ${getTransitionSpeed(unitData.movementMax)}`,
            delayed: {
                transform: 'translate(0, 0)',
            }
        }
    }

    if (lastMoveDirection) {
        console.log('Unit View ' + unitNumber + ' ' + lastMoveDirection)
        console.log(viewData.style);
    }
    return h(element, viewData, `${unitData.name} ${unitNumber}`);


    function getTransformForDirection(dir) {
        switch (dir) {
            case 'n':
                return `translate(0, ${TILE_SIZE}px)`;
            case'e':
                return `translate(-${TILE_SIZE}px, 0)`;
            case 's':
                return `translate(0, -${TILE_SIZE}px)`;
            case 'w':
                return `translate(${TILE_SIZE}px, 0)`;
            default:
                return '';
        }
    }

    function getTransitionSpeed(moveRate) {
        return moveRate < 5 ? '1s' : '.3s';
    }
}

module.exports = {
    UnitView
}
