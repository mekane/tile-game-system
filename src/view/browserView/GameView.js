const h = require('snabbdom/h').default;
const {TileView} = require('./TileView');
const tileSize = 100;

function GameView(state) {
    console.log('GaveView render');
    const tiles = [];

    const rowWidth = state.tiles[0].length; //TODO: compute this better and include in board state

    state.tiles.forEach(row => {
        row.forEach(tileData => {
            tiles.push(TileView(tileData));
        });
    });

    const style = {
        gridTemplateColumns: `repeat(${rowWidth}, ${tileSize}px)`
    };
    console.log(`game grid has style `, style);
    return h('div.game', {style}, tiles);
}

module.exports = {
    GameView
}
