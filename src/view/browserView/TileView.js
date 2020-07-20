const h = require('snabbdom/h').default;
const {cssSafeString} = require('../browserView/htmlHelpers');
const tileSize = 100;

function TileView(tileData) {
    if (tileData.empty) {
        return h(`div.tile.empty`, '');
    }
    else {
        const terrain = cssSafeString(tileData.name).toLowerCase();
        return h(`div.tile.${terrain}`, '');
    }
}

module.exports = {
    TileView
}
