const spaceshipTiles = require('./spaceshipMap.js');

const scenarioData = {
    "id": "scenario_test_85756276",
    "name": "Spaceship Level 1",
    "encounters": [{
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

import {GameContainer} from '../woodlandsGame/GameContainer.js';

GameContainer(scenarioData)
