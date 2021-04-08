const Game = require('../entities/Game.js');

function NewGame({gameRepository, scenarioRepository}) {
    return async function NewGame(name = 'New Game', scenarioId) {
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

        await gameRepository.save(newGame.toJson()); //TODO: standardize repository behavior
        return {
            success: true,
            created: newGame.getId()
        };
    }
}

module.exports = {
    NewGame
};
