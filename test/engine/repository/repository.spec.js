const expect = require('chai').expect;
const {inMemoryDataStore} = require('../../_mocks.js');

const {Repository} = require('../../../engine/repository/Repository.js');

const noop = _ => _;
const mockDataStore = {
    get: noop,
    list: noop,
    put: noop
}

describe('The Repository module', () => {
    it(`throws an error if the injected dataStore doesn't provide the required api`, () => {
        const missingGet = () => Repository({list: noop, put: noop});
        const missingList = () => Repository({get: noop, put: noop});
        const missingPut = () => Repository({get: noop, list: noop});

        expect(missingGet).to.throw(/Invalid DataStore: missing required method get/);
        expect(missingList).to.throw(/Invalid DataStore: missing required method list/);
        expect(missingPut).to.throw(/Invalid DataStore: missing required method put/);
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

describe('Repository Save', () => {
    it(`requires an id property to exist on the object being saved`, () => {
        const repository = Repository(mockDataStore);

        const noIdEmpty = () => repository.save();
        const noIdString = () => repository.save('foo');
        const noIdNumber = () => repository.save(1);
        const noIdArray = () => repository.save([]);
        const noIdObject = () => repository.save({});

        expect(noIdEmpty).to.throw(/Error saving to repository: no id property on/);
        expect(noIdString).to.throw(/Error saving to repository: no id property on/);
        expect(noIdNumber).to.throw(/Error saving to repository: no id property on/);
        expect(noIdArray).to.throw(/Error saving to repository: no id property on/);
        expect(noIdObject).to.throw(/Error saving to repository: no id property on/);
    })

    it(`is an async function that calls the put method on the data store`, async () => {
        const putSpy = {
            putCalled: 0,
            get: noop,
            list: noop,
            put: function() {
                this.putCalled++
            }
        }

        const repository = Repository(putSpy);
        const result = await repository.save({id: 'test'});

        expect(putSpy.putCalled).to.equal(1);
    })
})

describe('Repository Get', () => {
    it(`is an async function that calls the get method on the data store`, async () => {
        const getSpy = {
            getCalled: 0,
            get: function() {
                this.getCalled++
            },
            list: noop,
            put: noop
        }

        const repository = Repository(getSpy);
        const result = await repository.getById();

        expect(getSpy.getCalled).to.equal(1);
    })

    it(`returns something previously saved to the repository`, async () => {
        const id = 'test';
        const payload = {id, data: 'other stuff'};

        const repository = Repository(inMemoryDataStore());
        await repository.save(payload);

        const result = await repository.getById(id);
        expect(result).to.deep.equal(payload);
    });
})

describe('Repository List', () => {
    it(`returns an initially empty array`, async () => {
        const repository = Repository(inMemoryDataStore());
        const result = repository.list();
        expect(result).to.deep.equal([]);
    })

    it(`returns an array of everything that has been saved to the repo`, async () => {
        const items = [
            {id: 'id1', data: 'other stuff 1'},
            {id: 'id2', data: 'other stuff 2'},
            {id: 'id3', data: 'other stuff 3'}
        ];

        const repository = Repository(inMemoryDataStore());
        await Promise.all(items.map(repository.save));

        const result = repository.list();
        expect(result).to.deep.equal(items);
    })
})
