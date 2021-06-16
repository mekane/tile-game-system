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

function generateCirclePattern(radius) {
    const tiles = generateGrassTilesToFitSize(radius)
    const octant = Math.round(radius * Math.cos(Math.PI / 4));
    console.log('octant: ' + octant);

    for (let x = 0; x <= octant; x++) {
        const y = Math.round(Math.sqrt((radius * radius) - (x * x)));

        const row1 = yToRow(y);
        const row2 = yToRow(-y);

        const col1 = xToCol(x)
        const col2 = xToCol(-x)

        // console.log('set ', yToRow(y), xToCol(x))
        tiles[row1][col1] = 'R';
        tiles[row1][col2] = 'R';
        tiles[row2][col1] = 'R';
        tiles[row2][col2] = 'R';

        tiles[col1][row1] = 'R';
        tiles[col2][row1] = 'R';
        tiles[col1][row2] = 'R';
        tiles[col2][row2] = 'R';
    }

    console.log(tiles);
    return tiles;

    function xToCol(x) {
        return radius + x;
    }

    function yToRow(y) {
        return radius - y;
    }
}

module.exports = generateCirclePattern;