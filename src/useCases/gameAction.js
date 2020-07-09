const Game = require('../entities/Game');

function init({gameRepository}) {
    return async function gameAction(gameId, gameAction) {
        const game = await gameRepository.getById(gameId);

        if (!game)
            return {
                success: false,
                error: `No Game found for id ${gameId}`
            }

        try {
            game.sendAction(gameAction);
        } catch (err) {
            return {
                success: false,
                error: err.message
            }
        }

        await gameRepository.save(game);

        return {success: true};
    }
}

module.exports = init;
