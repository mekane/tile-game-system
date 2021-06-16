const tiles1 = [
    [' ', ' ', ' ', ' ', 'S', 'S', 'S', 'S', 'S', 'S', 'S', ' ', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'T', 'T', 'T'],
    [' ', ' ', ' ', ' ', 'S', 'G', 'T', 'T', 'T', 'T', 'S', 'S', 'S', 'G', 'G', 'G', 'G', 'G', 'S', 'S', 'R', 'T'],
    [' ', ' ', ' ', 'S', 'S', 'G', 'T', 'T', 'T', 'T', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'S', 'S', 'T'],
    [' ', 'S', 'S', 'S', 'G', 'G', 'T', 'T', 'T', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'R', 'S', 'S'],
    ['S', 'S', 'G', 'G', 'G', 'G', 'G', 'T', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'T', 'D', 'S'],
    ['S', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'T', 'S'],
    ['S', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'T', 'S'],
    ['R', 'R', 'R', 'R', 'R', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'T', 'T', 'S'],
    ['S', 'G', 'G', 'G', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'S'],
    ['S', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    ['S', 'G', 'G', 'G', 'G', 'T', 'T', 'T', 'T', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'H', 'S'],
    ['S', 'T', 'T', 'T', 'T', 'T', 'G', 'G', 'G', 'T', 'T', 'S', 'S', 'S', 'G', 'G', 'G', 'G', 'G', 'G', 'H', 'S'],
    ['S', 'T', 'T', 'T', 'T', 'T', 'G', 'G', 'G', 'G', 'H', 'S', ' ', 'S', 'G', 'G', 'G', 'G', 'G', 'G', 'H', 'S'],
    ['S', 'T', 'T', 'T', 'T', 'T', 'G', 'G', 'G', 'T', 'T', 'S', 'S', 'S', 'G', 'G', 'G', 'G', 'G', 'G', 'H', 'S'],
    ['S', 'S', 'S', 'T', 'T', 'T', 'T', 'G', 'G', 'T', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'H', 'H', 'S'],
    [' ', ' ', 'S', 'S', 'S', 'S', 'T', 'T', 'T', 'G', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'H', 'H', 'H', 'H', 'S'],
    [' ', ' ', ' ', ' ', ' ', 'S', 'S', 'S', 'S', 'S', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'H', 'H', 'H', 'H', 'S'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S', 'S', 'T', 'T', 'T', 'T', 'G', 'T', 'H', 'H', 'H', 'H', 'S'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S', 'T', 'T', 'T', 'T', 'G', 'G', 'H', 'H', 'H', 'H', 'S'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S', 'S', 'S', 'T', 'T', 'G', 'H', 'H', 'H', 'H', 'H', 'S'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S', 'S', 'T', 'T', 'H', 'H', 'H', 'H', 'H', 'S'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S']
];

const allGrass = [
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
];

function generateGrassTilesToFitSize(radius) {

    const size = 1 + radius * 2;
    const tiles = [];

    for (let i = 0; i < size; i++) {
        tiles.push(Array(size).fill('G'))
    }

    return tiles;
}

function getCoordinatesForCircle(cx, cy, radius) {
    const result = [];

    const octant = Math.round(radius * Math.cos(Math.PI / 4));

    for (let x = 0; x <= octant; x++) {
        const y = Math.round(Math.sqrt((radius * radius) - (x * x)));

        result.push({r: y + cy, c: x + cx});
        result.push({r: y + cy, c: -x + cx});
        result.push({r: -y + cy, c: x + cx});
        result.push({r: -y + cy, c: -x + cx});

        result.push({r: x + cy, c: y + cx});
        result.push({r: -x + cy, c: y + cx});
        result.push({r: x + cy, c: -y + cx});
        result.push({r: -x + cy, c: -y + cx});
    }

    return result;
}

function generateCirclePattern(centerX, centerY, radius) {
    const tiles = generateGrassTilesToFitSize(21)

    const coordinates = getCoordinatesForCircle(centerX, centerY, radius);
    coordinates.forEach(c => {
        tiles[c.r][c.c] = 'R'
    })

    return tiles;
}

module.exports = generateCirclePattern;