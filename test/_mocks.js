const {Repository} = require('../engine/repository/Repository.js');

const noop = () => null;

function mockRepository() {
    return Repository({get: noop, list: noop, put: noop});
}

function spyRepository() {
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

function inMemoryRepository(initialData) {
    return Repository(inMemoryDataStore(initialData));
}

function inMemoryDataStore(initialData) {
    let repo = initialData || {};

    return {
        get: id => repo[id],
        list: () => Object.values(repo),
        put: obj => repo[obj.id] = obj,
        debug: () => console.dir(repo)
    }
}

module.exports = {
    inMemoryDataStore,
    inMemoryRepository,
    mockRepository,
    spyRepository
}
