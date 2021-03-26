import {h} from 'snabbdom/h.js';
import {BoardView} from './BoardView.js';
import {UnitListView} from './UnitListView.js';

export function GameView(viewData) {
    /*PROFILE*/
    window.profileGameView['GameView']++;

    return h('div.game', [
        BoardView(viewData),
        UnitListView(viewData.state)
    ]);
}


