const GameActionUseCase = require('./gameAction');
const ListScenariosUseCase = require('./listScenarios');
const NewGameUseCase = require('./newGame');
const StartEncounterUseCase = require('./startEncounter');

function init({gameRepository, scenarioRepository}) {
    if (isInvalid(gameRepository))
        throw new Error('Error initializing Controller: missing repository gameRepository');

    if (isInvalid(scenarioRepository))
        throw new Error('Error initializing Controller: missing repository scenarioRepository');

    const gameAction = GameActionUseCase({gameRepository});
    const newGame = NewGameUseCase({gameRepository, scenarioRepository});
    const listScenarios = ListScenariosUseCase({scenarioRepository});
    const startEncounter = StartEncounterUseCase({gameRepository});

    return {
        gameAction,
        listScenarios,
        newGame,
        startEncounter
    }
}

function isInvalid(obj) {
    return typeof obj !== 'object';
}

module.exports = init;
