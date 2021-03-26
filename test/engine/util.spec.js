import chai from 'chai';

const expect = chai.expect;

import {
    adjustCoordinatesForDirection,
    DIRECTIONS,
    fileSafeString,
    generateId,
    groupUnitsByTurnOrder,
    secondaryDirectionCoordinates
} from '../../engine/util.js';

describe('The filesafe function', () => {
    it(`lowercases the characters in the string`, () => {
        expect(fileSafeString('ALLCAPS')).to.equal('allcaps');
        expect(fileSafeString('TestString')).to.equal('teststring');
    });

    it(`converts white-space to _ in the string`, () => {
        expect(fileSafeString('')).to.equal('');
        expect(fileSafeString('_')).to.equal('_');
        expect(fileSafeString('Test Name')).to.equal('test_name');
        expect(fileSafeString('   ')).to.equal('___');
        expect(fileSafeString('Hi\tThere')).to.equal('hi_there');
        expect(fileSafeString('Hi\nThere')).to.equal('hi_there');
    });

    it(`converts - to _`, () => {
        expect(fileSafeString('---')).to.equal('___');
        expect(fileSafeString('HI-There')).to.equal('hi_there');
    });

    it(`removes special characters from the string`, () => {
        expect(fileSafeString('?@/#$| [(key)]!')).to.equal('_key');
        expect(fileSafeString('+always =check %everything ~twice')).to.equal('always_check_everything_twice');
    });
});

describe('The generateId function', () => {
    it(`starts with the type`, () => {
        const id = generateId('test');
        expect(id.startsWith('test_')).to.equal(true);
    });

    it(`converts the type and name to filesafe strings`, () => {
        const id = generateId('Test Ty$pe', 'Test Na+me');
        expect(id.startsWith('test_type_test_name_')).to.equal(true);
    });

    it(`ends with numbers`, () => {
        const id = generateId('Type', 'Test');
        const validIdRegex = /^type_test_\d{6,8}/;
        const expectedMessage = `Expected ${id} to match regex ${validIdRegex}`;
        const matchedRegex = validIdRegex.test(id);
        expect(matchedRegex, expectedMessage).to.equal(true);
    });
});

describe('The adjustCoordinatesForDirection function', () => {
    it(`takes an x and y coordinate and a direction string and returns an {x,y} object`, () => {
        expect(adjustCoordinatesForDirection(1, 1, 'nw')).to.deep.equal({x: 0, y: 0});
    });

    it(`returns the original coordinates for unknown directions`, () => {
        expect(adjustCoordinatesForDirection(1, 1, 'bogus')).to.deep.equal({x: 1, y: 1});
    });

    it(`does the right thing for all the directions`, () => {
        expect(adjustCoordinatesForDirection(0, 0, 'nw')).to.deep.equal({x: -1, y: -1});
        expect(adjustCoordinatesForDirection(0, 0, 'n')).to.deep.equal({x: 0, y: -1});
        expect(adjustCoordinatesForDirection(0, 0, 'ne')).to.deep.equal({x: 1, y: -1});
        expect(adjustCoordinatesForDirection(0, 0, 'e')).to.deep.equal({x: 1, y: 0});
        expect(adjustCoordinatesForDirection(0, 0, 'se')).to.deep.equal({x: 1, y: 1});
        expect(adjustCoordinatesForDirection(0, 0, 's')).to.deep.equal({x: 0, y: 1});
        expect(adjustCoordinatesForDirection(0, 0, 'sw')).to.deep.equal({x: -1, y: 1});
        expect(adjustCoordinatesForDirection(0, 0, 'w')).to.deep.equal({x: -1, y: 0});
    });
});

describe('The directions constant', () => {
    it('exports an array of direction keys', () => {
        expect(DIRECTIONS).to.deep.equal(['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']);
    });
});

describe('The secondary direction coordinates function', () => {
    it('returns (0,0) for invalid directions', () => {
        expect(secondaryDirectionCoordinates()).to.deep.equal({x: 0, y: 0});
        expect(secondaryDirectionCoordinates(0)).to.deep.equal({x: 0, y: 0});
        expect(secondaryDirectionCoordinates('bogus')).to.deep.equal({x: 0, y: 0});
    });

    it('returns (0,0) for invalid steps and for step zero', () => {
        expect(secondaryDirectionCoordinates('nne')).to.deep.equal({x: 0, y: 0});
        expect(secondaryDirectionCoordinates('nne', -1)).to.deep.equal({x: 0, y: 0});
        expect(secondaryDirectionCoordinates('nne', 'A')).to.deep.equal({x: 0, y: 0});
        expect(secondaryDirectionCoordinates('nne', 0)).to.deep.equal({x: 0, y: 0});
    });

    it('returns coordinates in an X,Y,Y pattern for North by NorthEast', () => {
        expect(secondaryDirectionCoordinates('nne', 1)).to.deep.equal({x: 0, y: -1});
        expect(secondaryDirectionCoordinates('nne', 2)).to.deep.equal({x: 1, y: -1});
        expect(secondaryDirectionCoordinates('nne', 3)).to.deep.equal({x: 1, y: -2});
        expect(secondaryDirectionCoordinates('nne', 4)).to.deep.equal({x: 1, y: -3});
        expect(secondaryDirectionCoordinates('nne', 5)).to.deep.equal({x: 2, y: -3});
        expect(secondaryDirectionCoordinates('nne', 6)).to.deep.equal({x: 2, y: -4});
        expect(secondaryDirectionCoordinates('nne', 7)).to.deep.equal({x: 2, y: -5});
        expect(secondaryDirectionCoordinates('nne', 8)).to.deep.equal({x: 3, y: -5});
        expect(secondaryDirectionCoordinates('nne', 9)).to.deep.equal({x: 3, y: -6});
    });

    it('returns the same coordinates but negative Xs for North by NorthEast', () => {
        expect(secondaryDirectionCoordinates('nnw', 1)).to.deep.equal({x: 0, y: -1});
        expect(secondaryDirectionCoordinates('nnw', 2)).to.deep.equal({x: -1, y: -1});
        expect(secondaryDirectionCoordinates('nnw', 3)).to.deep.equal({x: -1, y: -2});
        expect(secondaryDirectionCoordinates('nnw', 4)).to.deep.equal({x: -1, y: -3});
        expect(secondaryDirectionCoordinates('nnw', 5)).to.deep.equal({x: -2, y: -3});
        expect(secondaryDirectionCoordinates('nnw', 6)).to.deep.equal({x: -2, y: -4});
        expect(secondaryDirectionCoordinates('nnw', 7)).to.deep.equal({x: -2, y: -5});
        expect(secondaryDirectionCoordinates('nnw', 8)).to.deep.equal({x: -3, y: -5});
        expect(secondaryDirectionCoordinates('nnw', 9)).to.deep.equal({x: -3, y: -6});
    });

    it('returns the same coordinates but negative Ys for South by SouthEast', () => {
        expect(secondaryDirectionCoordinates('sse', 1)).to.deep.equal({x: 0, y: 1});
        expect(secondaryDirectionCoordinates('sse', 2)).to.deep.equal({x: 1, y: 1});
        expect(secondaryDirectionCoordinates('sse', 3)).to.deep.equal({x: 1, y: 2});
        expect(secondaryDirectionCoordinates('sse', 4)).to.deep.equal({x: 1, y: 3});
        expect(secondaryDirectionCoordinates('sse', 5)).to.deep.equal({x: 2, y: 3});
        expect(secondaryDirectionCoordinates('sse', 6)).to.deep.equal({x: 2, y: 4});
        expect(secondaryDirectionCoordinates('sse', 7)).to.deep.equal({x: 2, y: 5});
        expect(secondaryDirectionCoordinates('sse', 8)).to.deep.equal({x: 3, y: 5});
        expect(secondaryDirectionCoordinates('sse', 9)).to.deep.equal({x: 3, y: 6});
    });

    it('returns the same coordinates but both negative for South by SouthWest', () => {
        expect(secondaryDirectionCoordinates('ssw', 1)).to.deep.equal({x: 0, y: 1});
        expect(secondaryDirectionCoordinates('ssw', 2)).to.deep.equal({x: -1, y: 1});
        expect(secondaryDirectionCoordinates('ssw', 3)).to.deep.equal({x: -1, y: 2});
        expect(secondaryDirectionCoordinates('ssw', 4)).to.deep.equal({x: -1, y: 3});
        expect(secondaryDirectionCoordinates('ssw', 5)).to.deep.equal({x: -2, y: 3});
        expect(secondaryDirectionCoordinates('ssw', 6)).to.deep.equal({x: -2, y: 4});
        expect(secondaryDirectionCoordinates('ssw', 7)).to.deep.equal({x: -2, y: 5});
        expect(secondaryDirectionCoordinates('ssw', 8)).to.deep.equal({x: -3, y: 5});
        expect(secondaryDirectionCoordinates('ssw', 9)).to.deep.equal({x: -3, y: 6});
    });

    it('returns coordinates flipped across x=y for East by NorthEast', () => {
        expect(secondaryDirectionCoordinates('ene', 1)).to.deep.equal({x: 1, y: 0});
        expect(secondaryDirectionCoordinates('ene', 2)).to.deep.equal({x: 1, y: -1});
        expect(secondaryDirectionCoordinates('ene', 3)).to.deep.equal({x: 2, y: -1});
        expect(secondaryDirectionCoordinates('ene', 4)).to.deep.equal({x: 3, y: -1});
        expect(secondaryDirectionCoordinates('ene', 5)).to.deep.equal({x: 3, y: -2});
        expect(secondaryDirectionCoordinates('ene', 6)).to.deep.equal({x: 4, y: -2});
        expect(secondaryDirectionCoordinates('ene', 7)).to.deep.equal({x: 5, y: -2});
        expect(secondaryDirectionCoordinates('ene', 8)).to.deep.equal({x: 5, y: -3});
        expect(secondaryDirectionCoordinates('ene', 9)).to.deep.equal({x: 6, y: -3});
    });

    it('returns coordinates with negative Ys for East by SouthEast', () => {
        expect(secondaryDirectionCoordinates('ese', 1)).to.deep.equal({x: 1, y: 0});
        expect(secondaryDirectionCoordinates('ese', 2)).to.deep.equal({x: 1, y: 1});
        expect(secondaryDirectionCoordinates('ese', 3)).to.deep.equal({x: 2, y: 1});
        expect(secondaryDirectionCoordinates('ese', 4)).to.deep.equal({x: 3, y: 1});
        expect(secondaryDirectionCoordinates('ese', 5)).to.deep.equal({x: 3, y: 2});
        expect(secondaryDirectionCoordinates('ese', 6)).to.deep.equal({x: 4, y: 2});
        expect(secondaryDirectionCoordinates('ese', 7)).to.deep.equal({x: 5, y: 2});
        expect(secondaryDirectionCoordinates('ese', 8)).to.deep.equal({x: 5, y: 3});
        expect(secondaryDirectionCoordinates('ese', 9)).to.deep.equal({x: 6, y: 3});
    });

    it('returns coordinates with negative Xs and Ys for West by SouthWest', () => {
        expect(secondaryDirectionCoordinates('wsw', 1)).to.deep.equal({x: -1, y: 0});
        expect(secondaryDirectionCoordinates('wsw', 2)).to.deep.equal({x: -1, y: 1});
        expect(secondaryDirectionCoordinates('wsw', 3)).to.deep.equal({x: -2, y: 1});
        expect(secondaryDirectionCoordinates('wsw', 4)).to.deep.equal({x: -3, y: 1});
        expect(secondaryDirectionCoordinates('wsw', 5)).to.deep.equal({x: -3, y: 2});
        expect(secondaryDirectionCoordinates('wsw', 6)).to.deep.equal({x: -4, y: 2});
        expect(secondaryDirectionCoordinates('wsw', 7)).to.deep.equal({x: -5, y: 2});
        expect(secondaryDirectionCoordinates('wsw', 8)).to.deep.equal({x: -5, y: 3});
        expect(secondaryDirectionCoordinates('wsw', 9)).to.deep.equal({x: -6, y: 3});
    });
});

describe('Grouping units by turn order', () => {
    it('returns a new empty list if an empty list is given', () => {
        const emptyList = [];
        expect(groupUnitsByTurnOrder(emptyList)).to.deep.equal([])
        expect(groupUnitsByTurnOrder(emptyList)).to.not.equal(emptyList)
    })

    it('puts units into sub-array groups', () => {
        const testData = [
            {turnOrder: 1},
            {turnOrder: 2},
            {turnOrder: 3}
        ]
        const actual = groupUnitsByTurnOrder(testData);
        expect(actual).to.be.an('array').with.length(3)
    })

    it('returns an array of indexes of the units in the original list', () => {
        const originalList = [
            {turnOrder: 1},
            {turnOrder: 6},
            {turnOrder: 9},
            {turnOrder: 1},
            {turnOrder: 6},
            {turnOrder: 9}
        ]
        const expected = [
            [0, 3], [1, 4], [2, 5]
        ]
        expect(groupUnitsByTurnOrder(originalList)).to.deep.equal(expected)
    })
})