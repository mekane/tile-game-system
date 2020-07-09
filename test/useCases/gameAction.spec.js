const expect = require('chai').expect;
const {validGame} = require('../_fixtures');

const validator = require('../../src/validator');
const GameActionUseCase = require('../../src/useCases/gameAction');

describe('The GameActionUseCase Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(GameActionUseCase).to.be.a('function');
    });

    it('returns a constructor function from the initializer', () => {
        const gameAction = GameActionUseCase({
            gameRepository: {}
        });
        expect(gameAction).to.be.a('function');
    });
});
