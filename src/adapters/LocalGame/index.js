const UseCasesInit = require('../../useCases/index');

const {inMemoryRepository} = require('../../../test/_mocks'); //TODO: make a different in-memory repo with tests

/**
 * This wraps the use cases, injects in-memory repositories, and exports an
 * interface of JS functions (as a library) to control a tile game.
 */
function init() {
    const gameRepository = inMemoryRepository();
    const scenarioRepository = inMemoryRepository();
    const useCases = UseCasesInit({gameRepository, scenarioRepository});

    return useCases;
}

module.exports = init;
