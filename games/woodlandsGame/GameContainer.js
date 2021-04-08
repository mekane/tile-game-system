import {BrowserView} from '../../view/browserView';

//This LocalGameAdapter runs everything in-browser, in memory and starts empty
const {LocalGameAdapter} = require('../../engine/adapters/LocalGame');

/**
 * Used to start up a Local Game that run in the browser totally in memory.
 * Assumes an element on the page with id="main"
 * Sets up a View with a basic action handler connected to the local adapter
 * @param scenarioDefinitions
 * @constructor
 */
export async function GameContainer(scenarioDefinitions) {
    const gameAdapter = LocalGameAdapter();
    const main = document.querySelector('#main');
    const view = BrowserView(main, handleAction)
    console.log(view)
    let activeUnitIndex = null;
    let lastUnitMove = {}; // slight hack for CSS transition animation to work in browser view

    await loadGameDefinitions(scenarioDefinitions)
    const gameId = await initGame();

    const nextState = await gameAdapter.gameState(gameId);
    activeUnitIndex = nextState.state.activeUnit;
    view.render(nextState);
    console.log('Done setting up Game Container');

    async function loadGameDefinitions(scenarioData) {
        //console.log(scenarioData);
        reportError(await gameAdapter.saveScenario(scenarioData));
    }

    async function initGame() {
        const newGameResult = await gameAdapter.newGame('New Game', scenarioDefinitions.id);
        reportError(newGameResult);
        const gameId = newGameResult.created;

        const startResult = await gameAdapter.startEncounter(gameId, 0);
        reportError(startResult);

        return gameId;
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
}


function reportError(result) {
    if (!result.success)
        console.log(result);
}
