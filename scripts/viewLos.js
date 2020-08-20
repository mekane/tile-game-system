#! /usr/bin/node
/**
 * A basic script to just mess around with the Board line-of-sight code directly,
 * since I don't currently have NPM available to install packages (just Node).
 *
 *
 */
const {validBoard} = require('../test/_fixtures');
const Board = require('../src/entities/Board');

const boardData = validBoard();
boardData.tiles = [
['A','A','A','A','A','A','A','A','A'],
['A','A','A','A','A','A','A','A','A'],
['A','A','A','A','A','A','A','A','A'],
['A','A','A','A','A','A','A','A','A'],
['A','A','A','A','A','A','A','A','A'],
['A','A','A','A','A','A','A','A','A'],
['A','A','A','A','A','A','A','A','A'],
['A','A','A','A','A','A','A','A','A'],
['A','A','A','A','A','A','A','A','A'],
];
const board = Board(boardData);

const positionX = 4;
const positionY = 4;
const losData = board.lineOfSightFor({positionX, positionY});

console.log('==== Terrain ====');
boardData.tiles.forEach((row, y) => {
  let line = '';
  row.forEach((col, x) => {
    line += (y == positionY && x == positionX) ? '@' : col;
  });
  console.log(line);
});
console.log('');
console.log('====-- LOS --====');
losData.forEach((row, y) => {
  let line = '';
  row.forEach((col, x) => {
    if (y == positionY && x == positionX)
      line += '@';
    else
      line += (col ? '#' : ' ');
  });
  console.log(line);
});

