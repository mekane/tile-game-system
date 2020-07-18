const h = require('snabbdom/h').default;

function GameView(state) {
    console.log('GaveView render');
    return h('div.game', "Game View");
}

module.exports = {
    GameView
}
