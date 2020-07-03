const Game = require('../entities/Game');

function init() {
    return function NewGame() {
        return Game({
            name: 'Test',
            scenario: {
                name: 'Test',
                encounter: {
                    name: 'Test',
                    description: 'A cool encounter',
                    board: {
                        name: 'Test',
                        tiles: [
                            ['A', 'A', 'B'],
                            ['C', 'A', 'A'],
                            ['D', 'A', 'A']
                        ],
                        terrain: {
                            A: {
                                name: 'Grass'
                            },
                            B: {
                                name: 'Trees'
                            },
                            C: {
                                name: 'Hills'
                            },
                            D: {
                                name: 'Stones'
                            }
                        }
                    },
                    units: [
                        {
                            name: 'Test',
                            movement: 6
                        }
                    ]
                }
            }
        });
    }
}

module.exports = init;
