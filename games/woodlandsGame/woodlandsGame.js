import woodlandTiles from './woodlandMap.js';
import {BrowserView} from '../../build/view.bundle.js';
import {LocalGameAdapter} from '../../engine/adapters/LocalGame/index.js';

const gameAdapter = LocalGameAdapter();
const main = document.querySelector('#main');
const view = BrowserView(main, handleAction)
console.log(view)
let gameId = null;
let activeUnitIndex = null;
let lastUnitMove = {}; // slight hack for CSS transition animation to work in browser view

initGame()
    .then(async function (gId) {
        console.log('Starting Woodlands Game');
        gameId = gId;
        const nextState = await gameAdapter.gameState(gameId);
        activeUnitIndex = nextState.state.activeUnit;
        view.render(nextState);
    });

async function initGame() {
    const scenarioData = {
        "id": "scenario_test_85756276",
        "name": "Test",
        "encounters": [{
            "id": "encounter_test_87381601",
            "name": "In the Woods",
            "description": "An outdoor encounter in the woods",
            "board": {
                "id": "board_test_06356206",
                "name": "Test",
                "tiles": woodlandTiles,
                "terrain": {
                    "G": {"name": "Grass"},
                    "R": {"name": "Road"},
                    "T": {"name": "Trees", "movementRequired": 2},
                    "H": {"name": "Hills", "movementRequired": 2},
                    "S": {"name": "Stones", "blocksMovement": true}
                }
            },
            "units": [
                {"id": "unit_goblin_06067272", "name": "Goblin", "movement": 60},
            ],
            "init": [
                {"action": "addUnit", "unitName": "Goblin", "boardX": 1, "boardY": 8}
            ]
        }]
    };
    //console.log(scenarioData);

    reportError(await gameAdapter.saveScenario(scenarioData));

    const newGameResult = await gameAdapter.newGame('New Game', 'scenario_test_85756276');
    reportError(newGameResult);
    const gameId = newGameResult.created;

    const startResult = await gameAdapter.startEncounter(gameId, 0);
    reportError(startResult);

    return gameId;
}

function reportError(result) {
    if (!result.success)
        console.log(result);
}

async function handleAction(properties) {
    console.log('game action', properties);

    let result = false;
    lastUnitMove = {};

    const actionType = properties.action;
    if (actionType === 'move') {
        const moveAction = {action: 'moveUnit', unitIndex: activeUnitIndex, direction: properties.dir};
        result = await gameAdapter.gameAction(gameId, moveAction);
        if (result.success)
            lastUnitMove = moveAction;
    } else if (actionType === 'unitDone') {
        result = await gameAdapter.gameAction(gameId, {action: 'doneActivating', unitIndex: properties});
    } else if (actionType === 'activateUnit') {
        result = await gameAdapter.gameAction(gameId, {action: 'activateUnit', unitIndex: properties})
    }

    if (result.success) {
        const nextState = await gameAdapter.gameState(gameId);
        activeUnitIndex = nextState.state.activeUnit;

        const stateToRender = Object.assign({lastUnitMove}, nextState);
        view.render(stateToRender);
    } else {
        console.log(result.error);
    }
}
