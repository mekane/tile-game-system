const snabbdom = require('snabbdom');
const toVNode = require('snabbdom/tovnode').default;
const patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/style').default,
    require('snabbdom/modules/eventlisteners').default
]);

const {GameView} = require('./GameView');

async function BrowserView(domElement, gameId, gameAdapter) {
    console.log('Init virtual DOM on', domElement);
    let vnode = toVNode(domElement);

    function render(nextState) {
        console.log('render', nextState);
        const nextView = GameView(nextState);
        vnode = patch(vnode, nextView);
    }

    const nextState = await gameAdapter.gameState(gameId);
    render(nextState);
}

module.exports = {
    BrowserView
}
