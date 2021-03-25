const snabbdom = require('snabbdom');
const toVNode = require('snabbdom/tovnode').default;
const patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/style').default,
    require('snabbdom/modules/eventlisteners').default
]);

const {GameView} = require('./GameView.js');

async function BrowserView(domElement, gameId, gameAdapter) {
    let vnode = toVNode(domElement);
    let activeUnitIndex = null;
    let lastUnitMove = {};

    initGlobalControls();
    const nextState = await gameAdapter.gameState(gameId);
    activeUnitIndex = nextState.state.activeUnit;
    render(nextState);

    async function action(actionType, properties) {
        console.log('game action ' + actionType, properties);

        let result = false;
        lastUnitMove = {};

        if (actionType === 'move') {
            const moveAction = {action: 'moveUnit', unitIndex: activeUnitIndex, direction: properties.dir};
            result = await gameAdapter.gameAction(gameId, moveAction);
            if (result.success)
                lastUnitMove = moveAction;
        }
        else if (actionType === 'unitDone') {
            result = await gameAdapter.gameAction(gameId, {action: 'doneActivating', unitIndex: properties});
        }
        else if (actionType === 'activateUnit') {
            result = await gameAdapter.gameAction(gameId, {action: 'activateUnit', unitIndex: properties})
        }

        if (result.success) {
            const nextState = await gameAdapter.gameState(gameId);
            activeUnitIndex = nextState.state.activeUnit;
            render(nextState);
        }
        else {
            console.log(result.error);
        }
    }

    function initGlobalControls() {
        window.viewAction = action;

        const body = document.querySelector('body');
        body.addEventListener('keyup', e => {
            switch (e.key) {
                case 'ArrowUp':
                    action('move', {dir: 'n'});
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    action('move', {dir: 'e'});
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    action('move', {dir: 's'});
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    action('move', {dir: 'w'});
                    e.preventDefault();
                    break;
                default:
                    console.log(e.key);
            }
        });

        body.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowRight':
                case 'ArrowDown':
                case 'ArrowLeft':
                    e.preventDefault();
                    break;
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

        //console.time("compute next view");
        const stateToRender = Object.assign({lastUnitMove}, nextState);
        const nextView = GameView(stateToRender);
        //console.timeEnd("compute next view");

        //console.time("patch DOM");
        vnode = patch(vnode, nextView);
        //console.timeEnd("patch DOM");

        //console.log('Game View Profile:', window.profileGameView);
    }
}

module.exports = {
    BrowserView
}
