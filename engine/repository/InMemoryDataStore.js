const {DataStore} = require("./DataStore.js");

class InMemoryDataStore extends DataStore {

    constructor(initialData) {
        super();
        this._dataStore = Object.assign({}, initialData);
    }

    get(id) {
        return this._dataStore[id]
    }

    list() {
        return Object.values(this._dataStore);
    }

    put(data) {
        this._dataStore[data.id] = data;
    }
}

module.exports = {
    InMemoryDataStore
}