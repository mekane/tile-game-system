const {GameAction} = require('./gameAction.js');
const {GameState} = require('./gameState.js');
const {ListScenarios} = require('./listScenarios.js');
const {NewGame} = require('./newGame.js');
const {SaveScenario} = require('./saveScenario.js');
const {StartEncounter} = require('./startEncounter.js');

function init({encounterActionFactory, gameRepository, scenarioRepository}) {
    if (isInvalid(gameRepository))
        throw new Error('Error initializing Controller: missing repository gameRepository');

    if (isInvalid(scenarioRepository))
        throw new Error('Error initializing Controller: missing repository scenarioRepository');

    const gameAction = GameAction({encounterActionFactory, gameRepository});
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

module.exports = init;
