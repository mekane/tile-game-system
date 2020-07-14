const expect = require('chai').expect;

const {Repository} = require('../../src/repository');

const noop = _ => _;
const mockDataStore = {
    get: noop,
    list: noop,
    save: noop
}

describe('The Repository module', () => {
    it(`throws an error if the injected dataStore doesn't provide the required api`, () => {
        const missingGet = () => Repository({list: noop, save: noop});
        const missingList = () => Repository({get: noop, save: noop});
        const missingSave = () => Repository({get: noop, list: noop});

        expect(missingGet).to.throw(/Invalid DataStore: missing required method get/);
        expect(missingList).to.throw(/Invalid DataStore: missing required method list/);
        expect(missingSave).to.throw(/Invalid DataStore: missing required method save/);
    });

    it(`exports an initializer function that takes a data store`, () => {
        expect(Repository).to.be.a('function');
    })

    it(`returns a repository object with standard methods`, () => {
        const repository = Repository(mockDataStore);

        expect(repository.getById).to.be.a('function');
        expect(repository.list).to.be.a('function');
        expect(repository.save).to.be.a('function');
        //expect(repository.debug).to.be.a('function');
    })
})
