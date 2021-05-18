'use strict'
const expect = require('chai').expect;

const EncounterActionFactory = require('../../../engine/entities/EncounterActionFactory.js');

describe('The Encounter Action Factory', () => {
    it(`exports a constructor function`, () => {
        expect(EncounterActionFactory).to.be.a('function')
    })

    it(`returns an object from the constructor with a getActionByName method`, () => {
        const factory = EncounterActionFactory()
        expect(factory.getActionByName).to.be.a('function')
    })

    it(`returns undefined for garbage and unknown action names`, () => {
        const factory = EncounterActionFactory()
        expect(factory.getActionByName()).to.be.an('undefined')
        expect(factory.getActionByName('')).to.be.an('undefined')
        expect(factory.getActionByName('garbage')).to.be.an('undefined')
        expect(factory.getActionByName(7)).to.be.an('undefined')
        expect(factory.getActionByName([])).to.be.an('undefined')
        expect(factory.getActionByName({})).to.be.an('undefined')
    })

    it(`returns built-in action functions by name`, () => {
        const factory = EncounterActionFactory()

        expect(factory.getActionByName('activateUnit')).to.be.a('function')
        expect(factory.getActionByName('addUnit')).to.be.a('function')
        expect(factory.getActionByName('markUnitDone')).to.be.a('function')
        expect(factory.getActionByName('moveUnit')).to.be.a('function')
    })

    it(`can be injected with a map of additional action names and functions`, () => {
        const factory = EncounterActionFactory({
            test: () => 'test action function'
        })

        const testAction = factory.getActionByName('test')
        expect(testAction()).to.equal('test action function')
    })

    it(`ignores non-functions in the injected action map`, () => {
        let bogus0;
        const factory = EncounterActionFactory({
            bogus0,
            bogus1: '',
            bogus2: 12,
            bogus3: [],
            bogus4: {},
        })

        expect(factory.getActionByName('bogus0')).to.be.an('undefined')
        expect(factory.getActionByName('bogus1')).to.be.an('undefined')
        expect(factory.getActionByName('bogus2')).to.be.an('undefined')
        expect(factory.getActionByName('bogus3')).to.be.an('undefined')
        expect(factory.getActionByName('bogus4')).to.be.an('undefined')
    })

    it(`matches action names case-insensitive`, () => {
        const factory = EncounterActionFactory({
            test: () => 'test action function',
            FOO: () => 'test action foo'
        })

        expect(factory.getActionByName('activateUnit')).to.be.a('function')
        expect(factory.getActionByName('ACTIVATEUNIT')).to.be.a('function')
        expect(factory.getActionByName('acTIvateUniT')).to.be.a('function')
        expect(factory.getActionByName('test')).to.be.a('function')
        expect(factory.getActionByName('TEST')).to.be.a('function')
        expect(factory.getActionByName('TeSt')).to.be.a('function')
        expect(factory.getActionByName('foo')).to.be.a('function')
        expect(factory.getActionByName('FOO')).to.be.a('function')
        expect(factory.getActionByName('FoO')).to.be.a('function')
    })
});