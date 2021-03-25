const expect = require('chai').expect;

const helpers = require('../../../view/browserView/htmlHelpers');

describe('Converting arbitrary strings to valid css class names', () => {
    it('does nothing for empty strings', () => {
        expect(helpers.cssSafeString('')).to.equal('c');
    });

    it('replaces whitespace with _', () => {
        expect(helpers.cssSafeString('a b\tc\nd')).to.equal('a_b_c_d');
    });

    it('keeps underscores', () => {
        expect(helpers.cssSafeString('a_1_b2')).to.equal('a_1_b2');
    });

    it('converts dashes to underscores', () => {
        expect(helpers.cssSafeString('a-1-b2')).to.equal('a_1_b2');
    });

    it('removes non-word characters', () => {
        expect(helpers.cssSafeString('a\\:/.,~`!@#$%^&*+<>?"')).to.equal('a');
    });

    it('removes other special characters', () => {
        expect(helpers.cssSafeString(`a(){}[]':;`)).to.equal('a');
    });

    it('adds "c" at the beginning if necessary', () => {
        expect(helpers.cssSafeString('abc')).to.equal('abc');
        expect(helpers.cssSafeString('$123')).to.equal('c123');
        expect(helpers.cssSafeString('+)(__123')).to.equal('__123');
        expect(helpers.cssSafeString('123')).to.equal('c123');
    });
})
