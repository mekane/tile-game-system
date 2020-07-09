const Game = require('../entities/Game');

function NewGameUseCase({gameRepository, scenarioRepository}) {
    return async function NewGame({name = '', scenarioId} = {}) {
        const newGame = Game({
            name,
            scenario: scenarioRepository.getScenario(scenarioId)
        });

        await gameRepository.putGame(newGame);
        return newGame;
    }
}

module.exports = NewGameUseCase;
