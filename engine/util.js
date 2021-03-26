export const directionAdjustmentsByDirection = {
    'n': {x: 0, y: -1},
    'ne': {x: 1, y: -1},
    'e': {x: 1, y: 0},
    'se': {x: 1, y: 1},
    's': {x: 0, y: 1},
    'sw': {x: -1, y: 1},
    'w': {x: -1, y: 0},
    'nw': {x: -1, y: -1},
}

export function adjustCoordinatesForDirection(x, y, direction) {
    const adj = directionAdjustmentsByDirection[direction] || {x: 0, y: 0};
    return {x: x + adj.x, y: y + adj.y}
}

function digit() {
    return (Math.random() * 9).toFixed();
}

export function fileSafeString(string) {
    const noSpaces = string.replace(/\s|-/g, '_');
    const noSpecialChars = noSpaces.replace(/[\W]/g, '');
    return noSpecialChars.toLowerCase();
}

export function generateId(type, name) {
    const prefix = fileSafeString(`${type}_${name}`);
    const number = [digit(), digit(), digit(), digit(), digit(), digit(), digit(), digit()].join('');
    return `${prefix}_${number}`;
}

export function groupUnitsByTurnOrder(originalUnits) {
    const units = originalUnits.slice();
    const turnOrderMap = {};

    units.forEach((unit, index) => {
        if (typeof turnOrderMap[unit.turnOrder] === 'undefined') {
            turnOrderMap[unit.turnOrder] = [];
        }
        turnOrderMap[unit.turnOrder].push(index);
    });
    const keys = Object.keys(turnOrderMap);
    return keys.map(key => turnOrderMap[key]);
}

export function secondaryDirectionCoordinates(direction, i) {
    if (typeof direction !== 'string' || typeof i !== 'number' || i <= 0)
        return {x: 0, y: 0};

    const d0 = direction[0];
    const d1 = direction[1];
    const d2 = direction[2];

    const xDir = (d2 === 'w' ? -1 : 1);
    const yDir = (d1 === 'n' ? -1 : 1);

    const isNS = (d0 === 'n' && d1 === 'n') || (d0 === 's' && d1 === 's');

    const shortPart = Math.floor((i + 1) / 3);
    const longPart = Math.floor(2 * (i - 1) / 3) + 1;

    const xPart = isNS ? shortPart : longPart;
    const yPart = isNS ? longPart : shortPart;

    const x = (xPart === 0 ? 0 : xPart * xDir); //avoid silly -0
    const y = (yPart === 0 ? 0 : yPart * yDir);

    return {x, y};
}

export const DIRECTIONS = Object.keys(directionAdjustmentsByDirection);
