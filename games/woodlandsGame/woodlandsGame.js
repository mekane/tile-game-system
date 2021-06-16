const woodlandTiles = require('./woodlandsMap.js');

const size = 21;

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
            "tiles": woodlandTiles(12, 12, 9),
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
            {"type": "AddUnit", "byName": "Goblin", "boardX": size, "boardY": size},
        ]
    }]
};

import {GameContainer} from "../GameContainer.js";

GameContainer(scenarioData)