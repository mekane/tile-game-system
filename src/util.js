const directionAdjustmentsByDirection = {
    'n': {x: 0, y: -1},
    'ne': {x: 1, y: -1},
    'e': {x: 1, y: 0},
    'se': {x: 1, y: 1},
    's': {x: 0, y: 1},
    'sw': {x: -1, y: 1},
    'w': {x: -1, y: 0},
    'nw': {x: -1, y: -1},
}

function adjustCoordinatesForDirection(x, y, direction) {
    const adj = directionAdjustmentsByDirection[direction] || {x: 0, y: 0};
    return {x: x + adj.x, y: y + adj.y}
}

function fileSafeString(string) {
    const noSpaces = string.replace(/\s|-/g, '_');
    const noSpecialChars = noSpaces.replace(/[\W]/g, '');
    return noSpecialChars.toLowerCase();
}

function generateId(type, name) {
    const prefix = fileSafeString(`${type}_${name}`);
    const number = [digit(), digit(), digit(), digit(), digit(), digit(), digit(), digit()].join('');
    return `${prefix}_${number}`;
}

function digit() {
    return (Math.random() * 9).toFixed();
}

module.exports = {
    adjustCoordinatesForDirection,
    DIRECTIONS: Object.keys(directionAdjustmentsByDirection),
    fileSafeString,
    generateId
}
