const h = require('snabbdom/h').default;
const {TileView, TILE_SIZE} = require('./TileView');

function GameView(state) {
    const rowWidth = state.tiles[0].length; //TODO: compute this better and include in board state

    const tiles = state.tiles.flatMap(makeTileViews);

    const style = {
        gridTemplateColumns: `repeat(${rowWidth}, ${TILE_SIZE}px)`
    };

    console.log(tiles);

    return h('div.game', {style}, tiles);
}

function makeTileViews(row, rowNumber) {
    return row.map((tile, tileNumber) => TileView(tile, tileNumber, rowNumber));
}

module.exports = {
    GameView
}
