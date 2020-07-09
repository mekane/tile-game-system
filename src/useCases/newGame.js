const Game = require('../entities/Game');

function NewGameUseCase({gameRepository, scenarioRepository}) {
    return async function NewGame({name = '', scenarioId} = {}) {
        const newGame = Game({
            name,
            scenario: scenarioRepository.getById(scenarioId)
        });

        await gameRepository.save(newGame);
        return newGame;
    }
}

module.exports = NewGameUseCase;
