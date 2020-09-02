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

describe('The directions constant', () => {
    it('exports an array of direction keys', () => {
        expect(util.DIRECTIONS).to.deep.equal(['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']);
    });
});

describe('The secondary direction coordinates function', () => {
    it('returns (0,0) for invalid directions', () => {
        expect(util.secondaryDirectionCoordinates()).to.deep.equal({x: 0, y: 0});
        expect(util.secondaryDirectionCoordinates(0)).to.deep.equal({x: 0, y: 0});
        expect(util.secondaryDirectionCoordinates('bogus')).to.deep.equal({x: 0, y: 0});
    });

    it('returns (0,0) for invalid steps and for step zero', () => {
        expect(util.secondaryDirectionCoordinates('nne')).to.deep.equal({x: 0, y: 0});
        expect(util.secondaryDirectionCoordinates('nne', -1)).to.deep.equal({x: 0, y: 0});
        expect(util.secondaryDirectionCoordinates('nne', 'A')).to.deep.equal({x: 0, y: 0});
        expect(util.secondaryDirectionCoordinates('nne', 0)).to.deep.equal({x: 0, y: 0});
    });

    it('returns coordinates in an X,Y,Y pattern for North by NorthEast', () => {
        expect(util.secondaryDirectionCoordinates('nne', 1)).to.deep.equal({x: 0, y: -1});
        expect(util.secondaryDirectionCoordinates('nne', 2)).to.deep.equal({x: 1, y: -1});
        expect(util.secondaryDirectionCoordinates('nne', 3)).to.deep.equal({x: 1, y: -2});
        expect(util.secondaryDirectionCoordinates('nne', 4)).to.deep.equal({x: 1, y: -3});
        expect(util.secondaryDirectionCoordinates('nne', 5)).to.deep.equal({x: 2, y: -3});
        expect(util.secondaryDirectionCoordinates('nne', 6)).to.deep.equal({x: 2, y: -4});
        expect(util.secondaryDirectionCoordinates('nne', 7)).to.deep.equal({x: 2, y: -5});
        expect(util.secondaryDirectionCoordinates('nne', 8)).to.deep.equal({x: 3, y: -5});
        expect(util.secondaryDirectionCoordinates('nne', 9)).to.deep.equal({x: 3, y: -6});
    });

    it('returns the same coordinates but negative Xs for North by NorthEast', () => {
        expect(util.secondaryDirectionCoordinates('nnw', 1)).to.deep.equal({x: 0, y: -1});
        expect(util.secondaryDirectionCoordinates('nnw', 2)).to.deep.equal({x: -1, y: -1});
        expect(util.secondaryDirectionCoordinates('nnw', 3)).to.deep.equal({x: -1, y: -2});
        expect(util.secondaryDirectionCoordinates('nnw', 4)).to.deep.equal({x: -1, y: -3});
        expect(util.secondaryDirectionCoordinates('nnw', 5)).to.deep.equal({x: -2, y: -3});
        expect(util.secondaryDirectionCoordinates('nnw', 6)).to.deep.equal({x: -2, y: -4});
        expect(util.secondaryDirectionCoordinates('nnw', 7)).to.deep.equal({x: -2, y: -5});
        expect(util.secondaryDirectionCoordinates('nnw', 8)).to.deep.equal({x: -3, y: -5});
        expect(util.secondaryDirectionCoordinates('nnw', 9)).to.deep.equal({x: -3, y: -6});
    });

    it('returns the same coordinates but negative Ys for South by SouthEast', () => {
        expect(util.secondaryDirectionCoordinates('sse', 1)).to.deep.equal({x: 0, y: 1});
        expect(util.secondaryDirectionCoordinates('sse', 2)).to.deep.equal({x: 1, y: 1});
        expect(util.secondaryDirectionCoordinates('sse', 3)).to.deep.equal({x: 1, y: 2});
        expect(util.secondaryDirectionCoordinates('sse', 4)).to.deep.equal({x: 1, y: 3});
        expect(util.secondaryDirectionCoordinates('sse', 5)).to.deep.equal({x: 2, y: 3});
        expect(util.secondaryDirectionCoordinates('sse', 6)).to.deep.equal({x: 2, y: 4});
        expect(util.secondaryDirectionCoordinates('sse', 7)).to.deep.equal({x: 2, y: 5});
        expect(util.secondaryDirectionCoordinates('sse', 8)).to.deep.equal({x: 3, y: 5});
        expect(util.secondaryDirectionCoordinates('sse', 9)).to.deep.equal({x: 3, y: 6});
    });

    it('returns the same coordinates but both negative for South by SouthWest', () => {
        expect(util.secondaryDirectionCoordinates('ssw', 1)).to.deep.equal({x: 0, y: 1});
        expect(util.secondaryDirectionCoordinates('ssw', 2)).to.deep.equal({x: -1, y: 1});
        expect(util.secondaryDirectionCoordinates('ssw', 3)).to.deep.equal({x: -1, y: 2});
        expect(util.secondaryDirectionCoordinates('ssw', 4)).to.deep.equal({x: -1, y: 3});
        expect(util.secondaryDirectionCoordinates('ssw', 5)).to.deep.equal({x: -2, y: 3});
        expect(util.secondaryDirectionCoordinates('ssw', 6)).to.deep.equal({x: -2, y: 4});
        expect(util.secondaryDirectionCoordinates('ssw', 7)).to.deep.equal({x: -2, y: 5});
        expect(util.secondaryDirectionCoordinates('ssw', 8)).to.deep.equal({x: -3, y: 5});
        expect(util.secondaryDirectionCoordinates('ssw', 9)).to.deep.equal({x: -3, y: 6});
    });

    it('returns coordinates flipped across x=y for East by NorthEast', () => {
        expect(util.secondaryDirectionCoordinates('ene', 1)).to.deep.equal({x: 1, y: 0});
        expect(util.secondaryDirectionCoordinates('ene', 2)).to.deep.equal({x: 1, y: -1});
        expect(util.secondaryDirectionCoordinates('ene', 3)).to.deep.equal({x: 2, y: -1});
        expect(util.secondaryDirectionCoordinates('ene', 4)).to.deep.equal({x: 3, y: -1});
        expect(util.secondaryDirectionCoordinates('ene', 5)).to.deep.equal({x: 3, y: -2});
        expect(util.secondaryDirectionCoordinates('ene', 6)).to.deep.equal({x: 4, y: -2});
        expect(util.secondaryDirectionCoordinates('ene', 7)).to.deep.equal({x: 5, y: -2});
        expect(util.secondaryDirectionCoordinates('ene', 8)).to.deep.equal({x: 5, y: -3});
        expect(util.secondaryDirectionCoordinates('ene', 9)).to.deep.equal({x: 6, y: -3});
    });

    it('returns coordinates with negative Ys for East by SouthEast', () => {
        expect(util.secondaryDirectionCoordinates('ese', 1)).to.deep.equal({x: 1, y: 0});
        expect(util.secondaryDirectionCoordinates('ese', 2)).to.deep.equal({x: 1, y: 1});
        expect(util.secondaryDirectionCoordinates('ese', 3)).to.deep.equal({x: 2, y: 1});
        expect(util.secondaryDirectionCoordinates('ese', 4)).to.deep.equal({x: 3, y: 1});
        expect(util.secondaryDirectionCoordinates('ese', 5)).to.deep.equal({x: 3, y: 2});
        expect(util.secondaryDirectionCoordinates('ese', 6)).to.deep.equal({x: 4, y: 2});
        expect(util.secondaryDirectionCoordinates('ese', 7)).to.deep.equal({x: 5, y: 2});
        expect(util.secondaryDirectionCoordinates('ese', 8)).to.deep.equal({x: 5, y: 3});
        expect(util.secondaryDirectionCoordinates('ese', 9)).to.deep.equal({x: 6, y: 3});
    });

    it('returns coordinates with negative Xs and Ys for West by SouthWest', () => {
        expect(util.secondaryDirectionCoordinates('wsw', 1)).to.deep.equal({x: -1, y: 0});
        expect(util.secondaryDirectionCoordinates('wsw', 2)).to.deep.equal({x: -1, y: 1});
        expect(util.secondaryDirectionCoordinates('wsw', 3)).to.deep.equal({x: -2, y: 1});
        expect(util.secondaryDirectionCoordinates('wsw', 4)).to.deep.equal({x: -3, y: 1});
        expect(util.secondaryDirectionCoordinates('wsw', 5)).to.deep.equal({x: -3, y: 2});
        expect(util.secondaryDirectionCoordinates('wsw', 6)).to.deep.equal({x: -4, y: 2});
        expect(util.secondaryDirectionCoordinates('wsw', 7)).to.deep.equal({x: -5, y: 2});
        expect(util.secondaryDirectionCoordinates('wsw', 8)).to.deep.equal({x: -5, y: 3});
        expect(util.secondaryDirectionCoordinates('wsw', 9)).to.deep.equal({x: -6, y: 3});
    });
});
