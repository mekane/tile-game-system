const Game = require('../entities/Game');

function GameStateUseCase({gameRepository}) {
    return async function gameState(gameId) {
        const gameData = await gameRepository.getById(gameId);

        if (!gameData)
            return {
                success: false,
                error: `No Game found for id ${gameId}`
            }

        const game = Game(gameData);

        return {
            success: true,
            state: game.getState()
        };
    }
}

module.exports = GameStateUseCase;
