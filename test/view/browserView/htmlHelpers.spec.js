const expect = require('chai').expect;

import {cssSafeString} from "../../../view/browserView/htmlHelpers.js";

describe('Converting arbitrary strings to valid css class names', () => {
    it('does nothing for empty strings', () => {
        expect(cssSafeString('')).to.equal('c');
    });

    it('replaces whitespace with _', () => {
        expect(cssSafeString('a b\tc\nd')).to.equal('a_b_c_d');
    });

    it('keeps underscores', () => {
        expect(cssSafeString('a_1_b2')).to.equal('a_1_b2');
    });

    it('converts dashes to underscores', () => {
        expect(cssSafeString('a-1-b2')).to.equal('a_1_b2');
    });

    it('removes non-word characters', () => {
        expect(cssSafeString('a\\:/.,~`!@#$%^&*+<>?"')).to.equal('a');
    });

    it('removes other special characters', () => {
        expect(cssSafeString(`a(){}[]':;`)).to.equal('a');
    });

    it('adds "c" at the beginning if necessary', () => {
        expect(cssSafeString('abc')).to.equal('abc');
        expect(cssSafeString('$123')).to.equal('c123');
        expect(cssSafeString('+)(__123')).to.equal('__123');
        expect(cssSafeString('123')).to.equal('c123');
    });
})
