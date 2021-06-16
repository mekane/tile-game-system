const dungeonTiles = require('./heroMap.js');

const scenarioData = {
    "id": "hero_game_scenario_1",
    "name": "Heroic Quest 1",
    "encounters": [{
        "id": "encounter_1",
        "name": "Heroic Quest 1",
        "description": "A heroic quest into a dangerous dungeon",
        "board": {
            "id": "basic_board",
            "name": "The Generic Board",
            tiles: dungeonTiles,
            "terrain": {
                H: {name: 'Hallway'},
                R: {name: 'Room 1', blocksEdges: true},
                T: {name: 'Room 2', blocksEdges: true},
                Y: {name: 'Room 3', blocksEdges: true},
                U: {name: 'Room 4', blocksEdges: true},
                W: {name: 'Wall', blocksMovement: true}
            }
        },
        "units": [
            {"id": "unit_hero_06067272", "name": "Barbarian", "movement": 120},
        ],
        "init": [
            {"type": "AddUnit", "byName": "Barbarian", "boardX": 0, "boardY": 0},
        ]
    }]
};

import {GameContainer} from '../GameContainer.js';

GameContainer(scenarioData)
