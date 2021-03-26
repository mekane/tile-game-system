import {init} from '../../useCases/index.js';
import {Repository} from '../../repository/index.js';

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
export function LocalGameAdapter() {
    const gameRepository = Repository(inMemoryDataStore());
    const scenarioRepository = Repository(inMemoryDataStore());
    const useCases = init({gameRepository, scenarioRepository});

    return useCases;
}
