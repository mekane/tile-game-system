const h = require('snabbdom/h').default;
const {cssSafeString} = require('../browserView/htmlHelpers');

const selector = 'div.tile';

function TileView(tileData, tileX, tileY) {
    /*PROFILE*/
    window.profileGameView['TileView']++;

    const elData = {
        class: {
            empty: tileData.empty
        },
        on: {
            click: e => console.log(`tile click (${tileX},${tileY})`)
        }
    };

    if (!tileData.empty) {
        const terrain = cssSafeString(tileData.name).toLowerCase();
        elData.class[terrain] = true;
    }

    //console.log(`compute tile view (${tileX},${tileY})`);
    return h(selector, elData, []);
}

module.exports = {
    TileView,
    TILE_SIZE: 32
}
