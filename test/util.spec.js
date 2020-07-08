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
        const validIdRegex = /^type_test_\d{6,8}/;
        const expectedMessage = `Expected ${id} to match regex ${validIdRegex}`;
        const matchedRegex = validIdRegex.test(id);
        expect(matchedRegex, expectedMessage).to.equal(true);
    });
});

describe('The adjustCoordinatesForDirection function', () => {
    it(`takes an x and y coordinate and a direction string and returns an {x,y} object`, () => {
        expect(util.adjustCoordinatesForDirection(1, 1, 'nw')).to.deep.equal({x: 0, y: 0});
    });

    it(`returns the original coordinates for unknown directions`, () => {
        expect(util.adjustCoordinatesForDirection(1, 1, 'bogus')).to.deep.equal({x: 1, y: 1});
    });

    it(`does the right thing for all the directions`, () => {
        expect(util.adjustCoordinatesForDirection(0, 0, 'nw')).to.deep.equal({x: -1, y: -1});
        expect(util.adjustCoordinatesForDirection(0, 0, 'n')).to.deep.equal({x: 0, y: -1});
        expect(util.adjustCoordinatesForDirection(0, 0, 'ne')).to.deep.equal({x: 1, y: -1});
        expect(util.adjustCoordinatesForDirection(0, 0, 'e')).to.deep.equal({x: 1, y: 0});
        expect(util.adjustCoordinatesForDirection(0, 0, 'se')).to.deep.equal({x: 1, y: 1});
        expect(util.adjustCoordinatesForDirection(0, 0, 's')).to.deep.equal({x: 0, y: 1});
        expect(util.adjustCoordinatesForDirection(0, 0, 'sw')).to.deep.equal({x: -1, y: 1});
        expect(util.adjustCoordinatesForDirection(0, 0, 'w')).to.deep.equal({x: -1, y: 0});
    });
});
