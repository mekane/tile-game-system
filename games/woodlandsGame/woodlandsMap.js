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

module.exports = [
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