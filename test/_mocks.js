const noop = () => null;

function mockRepository() {
    return {
        getById: noop,
        list: noop,
        save: noop
    }
}

function spyRepository() {
    return {
        getCalled: 0,
        listCalled: 0,
        saveCalled: 0,
        getById: function() {
            this.getCalled++
        },
        list: function() {
            this.listCalled++
        },
        save: function() {
            this.saveCalled++
        }
    }
}

function inMemoryRepository(initialData) {
    let repo = initialData || {};

    return {
        getById: id => repo[id],
        list: () => Object.values(repo),
        save: obj => repo[obj.id] = obj
    }
}

module.exports = {
    inMemoryRepository,
    mockRepository,
    spyRepository
}
