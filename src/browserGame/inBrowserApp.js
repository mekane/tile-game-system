const {BrowserView} = require('../view/browserView');
const LocalGameAdapter = require('../adapters/LocalGame');

const main = document.querySelector('#main');

const gameAdapter = LocalGameAdapter();

async function initGame() {
    await gameAdapter.saveScenario({
            "id": "scenario_test_85756276",
            "name": "Test",
            "encounters": [{
                "id": "encounter_test_87381601",
                "name": "In the Woods",
                "description": "An outdoor encounter in the woods",
                "board": {
                    "id": "board_test_06356206",
                    "name": "Test",
                    "tiles": [
                        ["A", "A", "B"],
                        ["C", "A", "B", "B"],
                        ["D", "A", "A"],
                    ],
                    "terrain": {
                        "A": {"name": "Grass"},
                        "B": {"name": "Trees"},
                        "C": {"name": "Hills", "movementRequired": 2},
                        "D": {"name": "Stones", "blocksMovement": true}
                    }
                },
                "units": [{"id": "unit_goblin_06067272", "name": "Goblin", "movement": 6}, {
                    "id": "unit_goblin_55818862",
                    "name": "Goblin",
                    "movement": 6
                }]
            }, {
                "id": "encounter_test_84134828",
                "name": "Hulking Space Ship",
                "description": "A grim dark encounter on an alien space ship",
                "board": {
                    "id": "board_test_92882731",
                    "name": "Test",
                    "tiles": [
                        ['W', 'W', 'W', 'W', 'W'],
                        ['W', 'R', 'R', 'R', 'W'],
                        ['W', 'R', 'R', 'R', 'D', 'H', 'H', 'H'],
                        ['W', 'R', 'R', 'R', 'W'],
                        ['W', 'W', 'W', 'W', 'W']
                    ],
                    "terrain": {
                        H: {name: 'Hallway'},
                        D: {name: 'Door'},
                        R: {name: 'Room'},
                        W: {name: 'Wall', blocksMovement: true}
                    }
                },
                "units": [{"id": "unit_goblin_17516600", "name": "Goblin", "movement": 6}, {
                    "id": "unit_goblin_68470464",
                    "name": "Goblin",
                    "movement": 6
                }]
            }]
        }
    );

    const result = await gameAdapter.newGame('New Game', 'scenario_test_85756276');
    const gameId = result.created;
    // set to 0 for the woods encounter
    // set to 1 for the space ship encounter
    await gameAdapter.startEncounter(gameId, 1);
    await gameAdapter.gameAction(gameId, {action: 'addUnit', unitName: 'Goblin', boardX: 1, boardY: 1});
    return gameId;
}

initGame()
    .then(gameId => BrowserView(main, gameId, gameAdapter));
