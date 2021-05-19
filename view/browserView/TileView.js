import {h} from 'snabbdom/h.js';
import {cssSafeString} from './htmlHelpers.js';

const selector = 'div.tile';

export function TileView(tileData, tileX, tileY, lineOfSightData) {
    /*PROFILE*/
    window.profileGameView['TileView']++;

    let visible = false;
    if (lineOfSightData[tileY])
        visible = lineOfSightData[tileY][tileX];

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

export const TILE_SIZE = 48;
