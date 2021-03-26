import {Repository} from '../engine/repository/index.js';

const noop = () => null;

export function mockRepository() {
    return Repository({get: noop, list: noop, put: noop});
}

export function spyRepository() {
    return {
        getCalled: 0,
        listCalled: 0,
        saveCalled: 0,
        getById: function () {
            this.getCalled++
        },
        list: function () {
            this.listCalled++
        },
        save: function () {
            this.saveCalled++
        }
    }
}

export function inMemoryRepository(initialData) {
    return Repository(inMemoryDataStore(initialData));
}

export function inMemoryDataStore(initialData) {
    let repo = initialData || {};

    return {
        get: id => repo[id],
        list: () => Object.values(repo),
        put: obj => repo[obj.id] = obj,
        debug: () => console.dir(repo)
    }
}
