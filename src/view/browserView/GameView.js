const h = require('snabbdom/h').default;
const {cssSafeString} = require('../browserView/htmlHelpers');
const tileSize = 100;

function GameView(state) {
    console.log('GaveView render');
    const tiles = [];

    const rowWidth = state.tiles[0].length; //TODO: compute this better and include in board state

    state.tiles.forEach(row => {
        row.forEach(tileData => {
            if (tileData.empty) {
                const tile = h(`div.tile.empty`, '');
                tiles.push(tile);
            }
            else {
                const terrain = cssSafeString(tileData.name).toLowerCase();
                const tile = h(`div.tile.${terrain}`, tileData.name);
                tiles.push(tile);
            }
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
