const expect = require('chai').expect;
const {validScenario} = require('./_fixtures');

const LibraryControllerInit = require('../src/LibraryController');

describe('The LibraryController', () => {
    it(`exports an object with use case functions`, () => {
        const libraryController = LibraryControllerInit();

        expect(libraryController).to.be.an('object');
        expect(libraryController.gameAction).to.be.a('function');
        expect(libraryController.newGame).to.be.a('function');
        expect(libraryController.startEncounter).to.be.a('function');
    });
});

describe('A realistic test using the JS Library Controller to make a new game', () => {
    it('creates, manipulates, and gets state for a Game', async () => {
        const controller = LibraryControllerInit();

        await populateSomeScenarios(controller);
        const list = await controller.listScenarios();

        let result = await controller.newGame('Test New Game', list[0].getId());
        expect(result.success).to.equal(true);
        const gameId = result.created;

        result = await controller.startEncounter(gameId, 0);
        expect(result.success).to.equal(true);

        result = await controller.gameAction(gameId, {action: 'addUnit', unitName: 'Goblin', boardX: 0, boardY: 0});
        expect(result.success).to.equal(true);

        result = await controller.gameAction(gameId, {action: 'moveUnit', unitIndex: 0, direction: 'e'});
        expect(result.success).to.equal(true);

        result = await controller.gameState(gameId);
        const unitDefId = result.state.units[0].definitionId;
        expect(result).to.deep.equal({
            success: true,
            state: {
                units: [{
                    "definitionId": unitDefId,
                    "movementMax": 6,
                    "movementRemaining": 5,
                    "name": "Goblin",
                    "positionX": 1,
                    "positionY": 0
                }]
            }
        });
    })
})

async function populateSomeScenarios(controller) {
    await controller.saveScenario(validScenario());
    await controller.saveScenario(validScenario());
    await controller.saveScenario(validScenario());
}
