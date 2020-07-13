const GameActionUseCase = require('./gameAction');
const GameStateUseCase = require('./gameState');
const ListScenariosUseCase = require('./listScenarios');
const NewGameUseCase = require('./newGame');
const SaveScenarioUseCase = require('./saveScenario');
const StartEncounterUseCase = require('./startEncounter');

function init({gameRepository, scenarioRepository}) {
    if (isInvalid(gameRepository))
        throw new Error('Error initializing Controller: missing repository gameRepository');

    if (isInvalid(scenarioRepository))
        throw new Error('Error initializing Controller: missing repository scenarioRepository');

    const gameAction = GameActionUseCase({gameRepository});
    const gameState = GameStateUseCase({gameRepository});
    const newGame = NewGameUseCase({gameRepository, scenarioRepository});
    const listScenarios = ListScenariosUseCase({scenarioRepository});
    const saveScenario = SaveScenarioUseCase({scenarioRepository});
    const startEncounter = StartEncounterUseCase({gameRepository});

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
