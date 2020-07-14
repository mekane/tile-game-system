const requiredDataStoreMethods = ['get', 'list', 'save'];

function Repository(dataStore) {

    requiredDataStoreMethods.forEach(method => {
        if (typeof dataStore[method] !== 'function')
            throw new Error(`Invalid DataStore: missing required method ${method}`);
    });

    return {
        getById: _ => _,
        list: () => '',
        save: _ => _,
    }
}

module.exports = {
    Repository
}
