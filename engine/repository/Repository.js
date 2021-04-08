const requiredDataStoreMethods = ['get', 'list', 'put'];

function Repository(dataStore) {

    requiredDataStoreMethods.forEach(method => {
        if (typeof dataStore[method] !== 'function')
            throw new Error(`Invalid DataStore: missing required method ${method}`);
    });

    function getById(id) {
        return dataStore.get(id)
    }

    function list() {
        return dataStore.list()
    }

    function save(item) {
        if (!item || typeof item.id === 'undefined') {
            throw new Error('Error saving to repository: no id property on ' + item);
        }
        dataStore.put(item);
    }

    return {
        getById,
        list,
        save
    }
}

module.exports = {
    Repository
}
