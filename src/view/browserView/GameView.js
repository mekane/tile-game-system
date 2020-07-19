const h = require('snabbdom/h').default;

const tileSize = 100;

function GameView(state) {
    console.log('GaveView render');
    const tiles = [];

    const rowWidth = state.board.tiles[0].length; //TODO: compute this better and include in board state

    state.board.tiles.forEach(row => {
        row.forEach(terrainName => {
            const tile = h('div.tile', terrainName);
            tiles.push(tile);
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
