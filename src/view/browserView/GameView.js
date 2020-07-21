const h = require('snabbdom/h').default;
const {BoardView} = require('./BoardView');
const {UnitListView} = require('./UnitListView');

function GameView(viewData) {
    return h('div.game', [
        BoardView(viewData.tiles, viewData.state.units),
        UnitListView(viewData.state.units)
    ]);
}


module.exports = {
    GameView
}

