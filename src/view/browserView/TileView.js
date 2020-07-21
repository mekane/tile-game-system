const h = require('snabbdom/h').default;
const {cssSafeString} = require('../browserView/htmlHelpers');

function TileView(tileData, tileX, tileY) {
    if (tileData.empty) {
        return h(`div.tile.empty`, '');
    }
    else {
        const terrain = cssSafeString(tileData.name).toLowerCase();
        const element = `div.tile.${terrain}`;

        const elData = {
            on: {
                click: e => console.log(`tile click (${tileX},${tileY})`)
            }
        };

        //console.log(`compute tile view (${tileX},${tileY})`);
        return h(element, elData, []);
    }
}

module.exports = {
    TileView,
    TILE_SIZE: 64
}
