const UseCasesInit = require('../../useCases/index');
const {Repository} = require('../../repository');

function inMemoryDataStore(initialData) {
    let repo = initialData || {};

    return {
        get: id => repo[id],
        list: () => Object.values(repo),
        put: obj => repo[obj.id] = obj,
        debug: () => console.dir(repo)
    }
}

/**
 * This wraps the use cases, injects in-memory repositories, and exports an
 * interface of JS functions (as a library) to control a tile game.
 */
function init() {
    const gameRepository = Repository(inMemoryDataStore());
    const scenarioRepository = Repository(inMemoryDataStore());
    const useCases = UseCasesInit({gameRepository, scenarioRepository});

    return useCases;
}

module.exports = init;
