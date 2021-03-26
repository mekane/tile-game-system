import {h} from 'snabbdom/h.js';
import {cssSafeString} from './htmlHelpers.js';

export function UnitView(unitData, unitNumber, isActive, TILE_SIZE, lastMoveDirection) {
    /*PROFILE*/
    window.profileGameView['UnitView']++;

    const unitName = cssSafeString(unitData.name).toLowerCase();
    const classes = ['div', 'unit', unitName];

    if (isActive)
        classes.push('active');

    const element = classes.join('.');

    const viewData = {
        style: {
            transform: getTransformForDirection(lastMoveDirection),
            transition: `transform ${getTransitionSpeed(unitData.movementMax)}`,
            delayed: {
                transform: 'translate(0, 0)',
            }
        }
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
