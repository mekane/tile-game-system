const woodlandTiles = require('./woodlandsMap.js');

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
            "tiles": woodlandTiles,
            "terrain": {
                "G": {"name": "Grass"},
                "R": {"name": "Road"},
                "T": {"name": "Trees", "movementRequired": 2},
                "H": {"name": "Hills", "movementRequired": 2},
                "S": {"name": "Stones", "blocksMovement": true}
            }
        },
        "units": [
            {"id": "unit_goblin_06067272", "name": "Goblin", "movement": 60},
        ],
        "init": [
            {"action": "addUnit", "unitName": "Goblin", "boardX": 1, "boardY": 8}
        ]
    }]
};

import {GameContainer} from "./GameContainer.js";

GameContainer(scenarioData)