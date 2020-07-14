const Game = require('../entities/Game');

function GameAction({gameRepository}) {
    return async function gameAction(gameId, gameAction) {
        const gameData = await gameRepository.getById(gameId);

        if (!gameData)
            return {
                success: false,
                error: `No Game found for id ${gameId}`
            }

        try {
            const game = Game(gameData);
            game.sendAction(gameAction);
            await gameRepository.save(game.toJson()); /* TODO: sort this out! */
        } catch (err) {
            return {
                success: false,
                error: err.message
            }
        }

        return {success: true};
    }
}

module.exports = {
    GameAction
};
