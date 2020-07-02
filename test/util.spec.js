const expect = require('chai').expect;

const util = require('../src/util');

describe('The filesafe function', () => {
    it(`lowercases the characters in the string`, () => {
        expect(util.fileSafeString('ALLCAPS')).to.equal('allcaps');
        expect(util.fileSafeString('TestString')).to.equal('teststring');
    });

    it(`converts white-space to _ in the string`, () => {
        expect(util.fileSafeString('')).to.equal('');
        expect(util.fileSafeString('_')).to.equal('_');
        expect(util.fileSafeString('Test Name')).to.equal('test_name');
        expect(util.fileSafeString('   ')).to.equal('___');
        expect(util.fileSafeString('Hi\tThere')).to.equal('hi_there');
        expect(util.fileSafeString('Hi\nThere')).to.equal('hi_there');
    });

    it(`converts - to _`, () => {
        expect(util.fileSafeString('---')).to.equal('___');
        expect(util.fileSafeString('HI-There')).to.equal('hi_there');
    });

    it(`removes special characters from the string`, () => {
        expect(util.fileSafeString('?@/#$| [(key)]!')).to.equal('_key');
        expect(util.fileSafeString('+always =check %everything ~twice')).to.equal('always_check_everything_twice');
    });
});

describe('The generateId function', () => {
    it(`starts with the type`, () => {
        const id = util.generateId('test');
        expect(id.startsWith('test_')).to.equal(true);
    });

    it(`converts the type and name to filesafe strings`, () => {
        const id = util.generateId('Test Ty$pe', 'Test Na+me');
        expect(id.startsWith('test_type_test_name_')).to.equal(true);
    });

    it(`ends with numbers`, () => {
        const id = util.generateId('Type', 'Test');
        const validIdRegex = /^type_test_\d{8}/;
        const expectedMessage = `Expected ${id} to match regex ${validIdRegex}`;
        const matchedRegex = validIdRegex.test(id);
        expect(matchedRegex, expectedMessage).to.equal(true);
    });
});
