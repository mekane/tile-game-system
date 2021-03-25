const h = require('snabbdom/h').default;
const {BoardView} = require('./BoardView.js');
const {UnitListView} = require('./UnitListView.js');

function GameView(viewData) {
    /*PROFILE*/window.profileGameView['GameView']++;

    return h('div.game', [
        BoardView(viewData),
        UnitListView(viewData.state)
    ]);
}


module.exports = {
    GameView
}

