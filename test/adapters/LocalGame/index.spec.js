const expect = require('chai').expect;
const {validScenario} = require('../../_fixtures');

const LocalGameAdapter = require('../../../src/adapters/LocalGame');

describe('The LocalGameAdapter', () => {
    it(`exports an object with use case functions`, () => {
        const localGameAdapter = LocalGameAdapter();

        expect(localGameAdapter).to.be.an('object');
        expect(localGameAdapter.gameAction).to.be.a('function');
        expect(localGameAdapter.newGame).to.be.a('function');
        expect(localGameAdapter.startEncounter).to.be.a('function');
    });
});

describe('A realistic test using the Local Game Adapter to make a new game', () => {
    it('creates, manipulates, and gets state for a Game', async () => {
        const localGameAdapter = LocalGameAdapter();

        await populateSomeScenarios(localGameAdapter);
        const list = await localGameAdapter.listScenarios();

        let result = await localGameAdapter.newGame('Test New Game', list[0].getId());
        expect(result.success).to.equal(true);
        const gameId = result.created;

        result = await localGameAdapter.startEncounter(gameId, 0);
        expect(result.success, `${result.error}`).to.equal(true);

        const addUnitAction = {action: 'addUnit', unitName: 'Goblin', boardX: 0, boardY: 0};
        result = await localGameAdapter.gameAction(gameId, addUnitAction);
        expect(result.success, `${result.error}`).to.equal(true);

        result = await localGameAdapter.gameAction(gameId, {action: 'moveUnit', unitIndex: 0, direction: 'e'});
        expect(result.success).to.equal(true);

        result = await localGameAdapter.gameState(gameId);
        expect(result.success).to.equal(true);
    })
})

async function populateSomeScenarios(adapter) {
    await adapter.saveScenario(validScenario());
    await adapter.saveScenario(validScenario());
    await adapter.saveScenario(validScenario());
}
