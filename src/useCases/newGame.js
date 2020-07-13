const Game = require('../entities/Game');

function NewGameUseCase({gameRepository, scenarioRepository}) {
    return async function NewGame({name = '', scenarioId} = {}) {
        const scenarioData = await scenarioRepository.getById(scenarioId);

        if (!scenarioData)
            return {
                success: false,
                error: `No Scenario found with id ${scenarioId}`
            }

        const newGame = Game({
            name,
            scenario: scenarioData
        });

        await gameRepository.save(newGame);
        return {
            success: true,
            created: newGame.getId()
        };
    }
}

module.exports = NewGameUseCase;
