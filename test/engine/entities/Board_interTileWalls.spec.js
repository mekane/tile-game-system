'use strict'
const expect = require('chai').expect;
const {validBoard} = require('../../_fixtures.js');
const Board = require('../../../engine/entities/Board.js');

describe('The getInterTileWalls method on the Board class', () => {
    it('returns a result array with the same dimensions as the original tiles', () => {
        const singleTile = [['F']]
        const board = makeBoard(singleTile)
        let wallData = board.getInterTileWalls()
        expect(wallData.length).to.equal(1)
        expect(wallData[0].length).to.equal(1)

        const board3x3 = Board(validBoard());
        wallData = board3x3.getInterTileWalls();
        expect(wallData.length).to.equal(3);
        expect(wallData[0].length).to.equal(3);
        expect(wallData[1].length).to.equal(3);
        expect(wallData[2].length).to.equal(3);

        const boardData2x4 = validBoard();
        boardData2x4.tiles = [
            ['F', 'F', 'F', 'F'],
            ['F', 'F', 'F', 'F']
        ];
        const board2x4 = Board(boardData2x4);
        wallData = board2x4.getInterTileWalls();
        expect(wallData.length).to.equal(2);
        expect(wallData[0].length).to.equal(4);
        expect(wallData[1].length).to.equal(4);
    })

    it(`has a data structure with 'r' and 'b' to indicate right wall and bottom wall`, () => {
        const wallData = makeBoard([['F']]).getInterTileWalls()
        const expectedWallData = [[{r: 0, b: 0}]]
        expect(wallData).to.deep.equal(expectedWallData)
    })

    it(`does not block edges between two normal terrain tiles`, () => {
        const wallDataH = makeBoard([['F', 'F']]).getInterTileWalls()
        const expectedWallDataH = [[{r: 0, b: 0}, {r: 0, b: 0}]]
        expect(wallDataH).to.deep.equal(expectedWallDataH)

        const wallDataV = makeBoard([['F'], ['F']]).getInterTileWalls()
        const expectedWallDataV = [[{r: 0, b: 0}], [{r: 0, b: 0}]]
        expect(wallDataV).to.deep.equal(expectedWallDataV)
    })

    it(`does not block edges between two blocking terrain tiles of the same type`, () => {
        const wallDataH = makeBoard([['X', 'X']]).getInterTileWalls()
        const expectedWallDataH = [[{r: 0, b: 0}, {r: 0, b: 0}]]
        expect(wallDataH).to.deep.equal(expectedWallDataH)

        const wallDataV = makeBoard([['X'], ['X']]).getInterTileWalls()
        const expectedWallDataV = [[{r: 0, b: 0}], [{r: 0, b: 0}]]
        expect(wallDataV).to.deep.equal(expectedWallDataV)
    })

    it(`indicates walls between two tiles of different terrain if one blocks edges`, () => {
        const wallDataH = makeBoard([['F', 'X']]).getInterTileWalls()
        const expectedWallDataH = [[{r: 1, b: 0}, {r: 0, b: 0}]]
        expect(wallDataH).to.deep.equal(expectedWallDataH)

        const wallDataV = makeBoard([['F'], ['X']]).getInterTileWalls()
        const expectedWallDataV = [[{r: 0, b: 1}], [{r: 0, b: 0}]]
        expect(wallDataV).to.deep.equal(expectedWallDataV)
    })

    it(`indicates walls between two tiles of different terrain if both block edges`, () => {
        const wallDataH = makeBoard([['X', 'Y']]).getInterTileWalls()
        const expectedWallDataH = [[{r: 1, b: 0}, {r: 0, b: 0}]]
        expect(wallDataH).to.deep.equal(expectedWallDataH)

        const wallDataV = makeBoard([['X'], ['Y']]).getInterTileWalls()
        const expectedWallDataV = [[{r: 0, b: 1}], [{r: 0, b: 0}]]
        expect(wallDataV).to.deep.equal(expectedWallDataV)
    })

    it(`correctly builds the data structure for a larger map`, () => {
        const tileData = [
            ['A', 'A', 'A'],
            ['A', 'X', 'X'],
            ['A', 'Y', 'Y']
        ]
        const wallData = makeBoard(tileData).getInterTileWalls()

        const expectedWallData = [
            [{r: 0, b: 0}, {r: 0, b: 1}, {r: 0, b: 1}],
            [{r: 1, b: 0}, {r: 0, b: 1}, {r: 0, b: 1}],
            [{r: 1, b: 0}, {r: 0, b: 0}, {r: 0, b: 0}]
        ]

        expect(wallData).to.deep.equal(expectedWallData)
    })
})

function makeBoard(tiles) {
    const boardData = validBoard();
    boardData.tiles = tiles;
    return Board(boardData)
}