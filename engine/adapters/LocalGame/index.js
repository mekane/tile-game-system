const UseCasesInit = require('../../useCases');
const {InMemoryDataStore} = require('../../repository/InMemoryDataStore.js');
const {Repository} = require('../../repository/Repository.js');

/**
 * This wraps the use cases, injects in-memory repositories, and exports an
 * interface of JS functions (as a library) to control a tile game.
 */
function LocalGameAdapter({encounterActionFactory}) {
    const gameRepository = Repository(new InMemoryDataStore());
    const scenarioRepository = Repository(new InMemoryDataStore());
    const useCases = UseCasesInit({encounterActionFactory, gameRepository, scenarioRepository});

    return useCases;
}

module.exports = {
    LocalGameAdapter
};
