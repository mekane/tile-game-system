const Game = require('../entities/Game.js');

function StartEncounter({gameRepository}) {
    return async function StartEncounter(gameId, encounterNumber) {
        const gameData = await gameRepository.getById(gameId);

        if (!gameData)
            return {
                success: false,
                error: `No Game found for id ${gameId}`
            }

        try {
            const game = Game(gameData);
            game.startEncounter(encounterNumber);
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
     StartEncounter
};
