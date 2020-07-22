const spaceshipTiles = require('./spaceshipMap');
const {BrowserView} = require('../view/browserView');
const LocalGameAdapter = require('../adapters/LocalGame');

const main = document.querySelector('#main');

const gameAdapter = LocalGameAdapter();

async function initGame() {
    const scenarioData = {
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
            }],
            "init": [
                {"action": "addUnit", "unitName": "Goblin", "boardX": 1, "boardY": 1}
            ]
        }, {
            "id": "encounter_test_84134828",
            "name": "Hulking Space Ship",
            "description": "A grim dark encounter on an alien space ship",
            "board": {
                "id": "board_test_92882731",
                "name": "Test",
                tiles: spaceshipTiles,
                "terrain": {
                    H: {name: 'Hallway'},
                    J: {name: 'Hallway2'},
                    D: {name: 'Door'},
                    R: {name: 'Room'},
                    W: {name: 'Wall', blocksMovement: true}
                }
            },
            "units": [
                {"id": "unit_marine_17516600", "name": "Space Marine", "movement": 40},
                {"id": "unit_genestealer_17516600", "name": "Genestealer", "movement": 6}
            ],
            "init": [
                {"action": "addUnit", "unitName": "Space Marine", "boardX": 4, "boardY": 12},
                {"action": "addUnit", "unitName": "Space Marine", "boardX": 3, "boardY": 12},
                {"action": "addUnit", "unitName": "Space Marine", "boardX": 2, "boardY": 12},
                {"action": "addUnit", "unitName": "Space Marine", "boardX": 1, "boardY": 12},
                {"action": "addUnit", "unitName": "Space Marine", "boardX": 0, "boardY": 12}
            ]
        }]
    };
    //console.log(scenarioData);

    reportError(await gameAdapter.saveScenario(scenarioData));

    const newGameResult = await gameAdapter.newGame('New Game', 'scenario_test_85756276');
    reportError(newGameResult);
    const gameId = newGameResult.created;

    // set to 0 for the woods encounter
    // set to 1 for the space ship encounter
    const startResult = await gameAdapter.startEncounter(gameId, 1);
    reportError(startResult);

    return gameId;
}

function reportError(result) {
    if (!result.success)
        console.log(result);
}

initGame()
    .then(gameId => BrowserView(main, gameId, gameAdapter));
