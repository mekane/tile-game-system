const h = require('snabbdom/h').default;
const {BoardView} = require('./BoardView');
const {UnitListView} = require('./UnitListView');

function GameView(viewData) {
    /*PROFILE*/window.profileGameView['GameView']++;

    return h('div.game', [
        BoardView(viewData.tiles, viewData.state.units, viewData.lastUnitMove),
        UnitListView(viewData.state.units)
    ]);
}


module.exports = {
    GameView
}

