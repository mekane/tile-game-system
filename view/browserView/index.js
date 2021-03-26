import {init} from 'snabbdom/snabbdom.js'
import {attributesModule} from 'snabbdom/modules/attributes.js'
import {classModule} from 'snabbdom/modules/class.js'
import {eventListenersModule} from 'snabbdom/modules/eventlisteners.js'
import {propsModule} from 'snabbdom/modules/props.js'
import {styleModule} from 'snabbdom/modules/style.js'

import {toVNode} from 'snabbdom/tovnode.js';

const patch = init([ // Init patch function with chosen modules
    attributesModule,
    classModule,
    eventListenersModule,
    propsModule,
    styleModule
]);

import {GameView} from './GameView.js'

/**
 * @param {Node} domElement
 * @param {Function} actionHandler
 */
export function BrowserView(domElement, actionHandler) {
    let vNode = toVNode(domElement);

    initGlobalControls();

    return {
        render
    }

    function initGlobalControls() {
        window.viewAction = actionHandler;

        const body = document.querySelector('body');
        body.addEventListener('keyup', e => {
            switch (e.key) {
                case 'ArrowUp':
                    actionHandler({action: 'move', dir: 'n'});
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    actionHandler({action: 'move', dir: 'e'});
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    actionHandler({action: 'move', dir: 's'});
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    actionHandler({action: 'move', dir: 'w'});
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
        const nextView = GameView(nextState);
        //console.timeEnd("compute next view");

        //console.time("patch DOM");
        vNode = patch(vNode, nextView);
        //console.timeEnd("patch DOM");

        //console.log('Game View Profile:', window.profileGameView);
    }
}
