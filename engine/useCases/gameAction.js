const Game = require('../entities/Game.js');

function GameAction({encounterActionFactory, gameRepository}) {
    //TODO: validate injected deps(?)
    // if (encounterActionFactory.getActionByName !== 'function'

    return async function gameAction(gameId, gameAction) {
        const gameData = await gameRepository.getById(gameId);

        if (!gameData)
            return {
                success: false,
                error: `No Game found for id ${gameId}`
            }

        const action = encounterActionFactory.getActionByName(gameAction.action);
        if (typeof action !== 'function')
            return {
                success: false,
                error: 'Unknown action: ' + gameAction.action
            }

        try {
            const game = Game(gameData);
            const events = action(game.getState(), gameAction, game.getCurrentEncounter());

            //TODO: always get an array
            game.sendEvent(events);

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
