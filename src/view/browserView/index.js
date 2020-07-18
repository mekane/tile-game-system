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

async function BrowserView(domElement, gameAdapter) {
    console.log('Init virtual DOM on', domElement);
    let vnode = toVNode(domElement);

    function render(nextState) {
        console.log('render', nextState);
        const nextView = GameView(nextState);
        vnode = patch(vnode, nextView);
    }

    let result = await initTestScenario(gameAdapter);
    console.log('Save Scenario', result);

    result = await gameAdapter.newGame('New Game', 'scenario_test_85756276');
    console.log('New Game', result);
    const gameId = result.created;

    result = await gameAdapter.startEncounter(gameId, 0);
    console.log('Start Encounter', result);

    result = await gameAdapter.gameAction(gameId, {action: 'addUnit', unitName: 'Goblin', boardX: 0, boardY: 0});
    console.log('Add Unit', result);

    const nextState = await gameAdapter.gameState(gameId);
    render(nextState);
}

module.exports = {
    BrowserView
}





function initTestScenario(gameAdapter) {
    return gameAdapter.saveScenario({
            "id": "scenario_test_85756276",
            "name": "Test",
            "encounters": [{
                "id": "encounter_test_87381601",
                "name": "Test",
                "description": "A cool encounter",
                "board": {
                    "id": "board_test_06356206",
                    "name": "Test",
                    "tiles": [["A", "A", "C"], ["C", "A", "B"], ["D", "A", "A"]],
                    "terrain": {
                        "A": {"name": "Grass"},
                        "B": {"name": "Trees"},
                        "C": {"name": "Hills", "movementRequired": 2},
                        "D": {"name": "Stones", "blocksMovement": true}
                    }
                },
                "units": [{"id": "unit_goblin_06067272", "name": "Goblin", "movement": 6}, {
                    "id": "unit_goblin_55818862",
                    "name": "Goblin",
                    "movement": 6
                }]
            }, {
                "id": "encounter_test_84134828",
                "name": "Test",
                "description": "A cool encounter",
                "board": {
                    "id": "board_test_92882731",
                    "name": "Test",
                    "tiles": [["A", "A", "C"], ["C", "A", "B"], ["D", "A", "A"]],
                    "terrain": {
                        "A": {"name": "Grass"},
                        "B": {"name": "Trees"},
                        "C": {"name": "Hills", "movementRequired": 2},
                        "D": {"name": "Stones", "blocksMovement": true}
                    }
                },
                "units": [{"id": "unit_goblin_17516600", "name": "Goblin", "movement": 6}, {
                    "id": "unit_goblin_68470464",
                    "name": "Goblin",
                    "movement": 6
                }]
            }]
        }
    );
}
