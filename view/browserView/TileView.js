const h = require('snabbdom/h').default;
const {cssSafeString} = require('./htmlHelpers.js');

const selector = 'div.tile';

function TileView(tileData, tileX, tileY, lineOfSightData) {
    /*PROFILE*/
    window.profileGameView['TileView']++;

    const visible = lineOfSightData[tileY][tileX];

    const elData = {
        class: {
            empty: tileData.empty,
            visible
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
    TILE_SIZE: 48
}
