const noop = () => null;

function mockRepository() {
    return {
        getById: noop,
        save: noop
    }
}

function spyRepository() {
    return {
        getCalled: 0,
        saveCalled: 0,
        getById: function() {
            this.getCalled++
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
        save: obj => repo[obj.id] = obj
    }
}

module.exports = {
    inMemoryRepository,
    mockRepository,
    spyRepository
}
