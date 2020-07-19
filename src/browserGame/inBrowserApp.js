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
                "name": "Test",
                "description": "A cool encounter",
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
                "name": "Test",
                "description": "A cool encounter",
                "board": {
                    "id": "board_test_92882731",
                    "name": "Test",
                    "tiles": [["A", "A", "C"], ["C", "A", "B"], ["D", "A", "A"]],
                    "terrain": {
                        "A": {"name": "Grass"},
                        "B": {"name": "Trees"},
                        "C": {"name": "Hills", "movementRequired": 2},
                        "D": {"name": "Stones", "blocksMovement": true}
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
    await gameAdapter.startEncounter(gameId, 0);
    await gameAdapter.gameAction(gameId, {action: 'addUnit', unitName: 'Goblin', boardX: 0, boardY: 0});
    return gameId;
}

initGame()
    .then(gameId => BrowserView(main, gameId, gameAdapter));
