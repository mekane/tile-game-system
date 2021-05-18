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

    it(``, () => {
    })
});