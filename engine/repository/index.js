const requiredDataStoreMethods = ['get', 'list', 'put'];

export function Repository(dataStore) {

    requiredDataStoreMethods.forEach(method => {
        if (typeof dataStore[method] !== 'function')
            throw new Error(`Invalid DataStore: missing required method ${method}`);
    });

    function save(item) {
        if (!item || typeof item.id === 'undefined') {
            throw new Error('Error saving to repository: no id property on ' + item);
        }
        dataStore.put(item);
    }

    return {
        getById: id => dataStore.get(id),
        list: dataStore.list,
        save,
    }
}

