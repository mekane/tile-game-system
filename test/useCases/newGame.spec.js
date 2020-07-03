const expect = require('chai').expect;
const validator = require('../../src/validator');

const newGameInit = require('../../src/useCases/newGame');

describe('The NewGame Use Case Initializer', () => {
    it(`exports an init function to inject the module with dependencies`, () => {
        expect(newGameInit).to.be.a('function');
    });

    it('returns a constructor function from the initializer', () => {
        const NewGameUseCase = newGameInit();
        expect(NewGameUseCase).to.be.a('function');
    });
});

describe('The NewGame Use Case Constructor', () => {
    it('returns a new Game instance', () => {
        const NewGameUseCase = newGameInit();
        const newGame = NewGameUseCase();

        expect(newGame).to.be.an('object');
        expect(newGame.getId().startsWith('game_test_')).to.equal(true);

        //expect(validator.validateAs(newGame, 'Game')).to.equal(true);
    });
});
