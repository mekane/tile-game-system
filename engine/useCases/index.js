import {GameAction} from './gameAction.js';
import {GameState} from './gameState.js';
import {ListScenarios} from './listScenarios.js';
import {NewGame} from './newGame.js';
import {SaveScenario} from './saveScenario.js';
import {StartEncounter} from './startEncounter.js';

export function init({gameRepository, scenarioRepository}) {
    if (isInvalid(gameRepository))
        throw new Error('Error initializing Controller: missing repository gameRepository');

    if (isInvalid(scenarioRepository))
        throw new Error('Error initializing Controller: missing repository scenarioRepository');

    const gameAction = GameAction({gameRepository});
    const gameState = GameState({gameRepository});
    const newGame = NewGame({gameRepository, scenarioRepository});
    const listScenarios = ListScenarios({scenarioRepository});
    const saveScenario = SaveScenario({scenarioRepository});
    const startEncounter = StartEncounter({gameRepository});

    return {
        gameAction,
        gameState,
        listScenarios,
        newGame,
        saveScenario,
        startEncounter
    }
}

function isInvalid(obj) {
    return typeof obj !== 'object';
}

