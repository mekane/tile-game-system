/**
 * Base class for DataStore to define the interface.
 * Should not be used directly.
 * @abstract
 */
class DataStore {
    constructor() {
        return null;
    }

    /** @abstract */
    get(id) {
    }

    /** @abstract */
    list() {
        return []
    }

    /** @abstract */
    put(data) {
    }
}

module.exports = {
    DataStore
};