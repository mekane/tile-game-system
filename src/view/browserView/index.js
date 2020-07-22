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

let lastUnitMove = {};

async function BrowserView(domElement, gameId, gameAdapter) {
    let vnode = toVNode(domElement);

    initGlobalControls();
    const nextState = await gameAdapter.gameState(gameId);
    render(nextState);

    async function action(actionType, properties) {
        console.log('game action ' + actionType, properties);

        const moveAction = {action: 'moveUnit', unitIndex: 0, direction: properties.dir};
        const moveResult = await gameAdapter.gameAction(gameId, moveAction);
        if (moveResult.success) {
            lastUnitMove = moveAction;
            const nextState = await gameAdapter.gameState(gameId);
            nextState.lastUnitMove = lastUnitMove;
            render(nextState);
        }
        else {
            console.log(moveResult.error);
            lastUnitMove = {};
        }
    }

    function initGlobalControls() {
        const body = document.querySelector('body');
        body.addEventListener('keyup', e => {
            switch (e.key) {
                case 'ArrowUp':
                    action('move', {dir: 'n'});
                    break;
                case 'ArrowRight':
                    action('move', {dir: 'e'});
                    break;
                case 'ArrowDown':
                    action('move', {dir: 's'});
                    break;
                case 'ArrowLeft':
                    action('move', {dir: 'w'});
                    break;
                default:
                    console.log(e.key);
            }
        });
    }

    function render(nextState) {
        console.log('render', nextState);

        window.profileGameView = {
            'BoardView': 0,
            'GameView': 0,
            'TileView': 0,
            'UnitListView': 0,
            'UnitView': 0
        };

        console.time("compute next view");
        const nextView = GameView(nextState);
        console.timeEnd("compute next view");

        console.time("patch DOM");
        vnode = patch(vnode, nextView);
        console.timeEnd("patch DOM");

        console.log('Game View Profile:', window.profileGameView);
    }
}

module.exports = {
    BrowserView
}
