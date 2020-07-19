const Game = require('../entities/Game');

function GameState({gameRepository}) {
    return async function gameState(gameId) {
        const gameData = await gameRepository.getById(gameId);

        if (!gameData)
            return {
                success: false,
                error: `No Game found for id ${gameId}`
            }

        const game = Game(gameData);

        const boardData = game.getCurrentBoard().toJson();
        delete boardData.id;

        return {
            success: true,
            state: game.getState(),
            board: boardData
        };
    }
}

module.exports = {
    GameState
};
