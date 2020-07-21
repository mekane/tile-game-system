const h = require('snabbdom/h').default;
const {TileView, TILE_SIZE} = require('./TileView');
const {UnitView} = require('./UnitView');

function BoardView(tileData, units) {
    const rowHeight = tileData.length; //TODO: include in board state
    const rowWidth = tileData[0].length; //TODO: compute this better and include in board state

    const tiles = tileData.flatMap(makeTileViews);

    const style = {
        gridTemplateColumns: `repeat(${rowWidth}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${rowHeight}, ${TILE_SIZE}px)`,
        fontSize: `${TILE_SIZE / 4}px`
    };

    units.forEach(makeUnitView);

    return h('div.board', {style}, tiles);


    function getTileNumber(x, y) {
        return y * rowWidth + x;
    }

    function makeUnitView(unitData, unitNumber) {
        const tileNumber = getTileNumber(unitData.positionX, unitData.positionY);
        tiles[tileNumber].children.push(UnitView(unitData, unitNumber));
    }
}

function makeTileViews(row, rowNumber) {
    return row.map((tile, tileNumber) => TileView(tile, tileNumber, rowNumber));
}

module.exports = {
    BoardView
}
