let unitId = 0;

function validBoard() {
    return {
        name: 'Test',
        tiles: [
            ['A', 'A', 'C'],
            ['C', 'A', 'B'],
            ['W', 'A', 'A']
        ],
        terrain: {
            A: {
                name: 'Grass'
            },
            B: {
                name: 'Trees'
            },
            C: {
                name: 'Hills',
                movementRequired: 2
            },
            W: {
                name: 'Wall',
                blocksMovement: true
            }
        }
    }
}

function validEncounter(overrides) {
    return Object.assign({
        name: 'Test',
        description: 'A cool encounter',
        board: validBoard(),
        units: [
            validUnit(),
            validUnit()
        ]
    }, overrides);
}

function validEncounterWithInitialUnit(overrides) {
    const encounterWithInit = validEncounter({
        name: 'Test Encounter With Initial Unit',
        init: [
            validAddUnitGameEvent()
        ]
    });
    return Object.assign(encounterWithInit, overrides);
}

function validGame(overrides) {
    return Object.assign({
        name: 'Test',
        scenario: validScenario(),
        currentEncounterIndex: 0
    }, overrides);
}

function validAddUnitGameEvent() {
    return {
        type: 'AddUnit',
        unit: {
            name: 'Goblin',
            positionX: 0,
            positionY: 0,
        }
    }
}

function validScenario(overrides) {
    return Object.assign({
        name: 'Test',
        encounters: [
            validEncounter(),
            validEncounter()
        ]
    }, overrides);
}

function validUnit() {
    return {
        id: 'Unit_' + unitId++,
        name: 'Goblin',
        movement: 6,
        turnOrder: 1
    }
}


function gameDataWithMoreEncounterDetail() {
    const simpleBoard = {
        id: 'board_simple_1234',
        name: 'Simple Board',
        tiles: [['A']],
        terrain: {A: {name: 'A'}}
    }

    const complexBoard = {
        id: 'board_complex_1235',
        name: 'Complex Board',
        tiles: [
            ['W', 'W', 'W', 'W', 'W'],
            ['W', 'A', 'A', 'A', 'W'],
            ['W', 'B', 'A', 'A', 'A'],
            ['W', 'A', 'A', 'A', 'W'],
            ['W', 'W', 'W', 'W', 'W']
        ],
        terrain: {
            A: {
                name: 'Floor'
            },
            B: {
                name: 'Sticky Floor',
                movementRequired: 2
            },
            W: {
                name: 'Wall',
                blocksMovement: true
            }
        }
    }
    return {
        id: 'game_simple_1234',
        name: 'Test Game',
        scenario: {
            id: 'scenario_simple_1234',
            name: 'Test Scenario',
            encounters: [{
                id: 'encounter_simple_1234',
                name: 'Test Encounter',
                description: 'A simple encounter',
                board: simpleBoard,
                units: [
                    {
                        id: 'unit_simple_1234',
                        name: 'Test Unit',
                        movement: 5
                    }
                ]
            }, {
                id: 'encounter_simple_1235',
                name: 'Test Encounter 2',
                description: 'A complex encounter',
                board: complexBoard,
                units: [
                    {
                        id: 'unit_simple_1235',
                        name: 'Test Unit 2',
                        movement: 6
                    }
                ]
            }]
        }
    }
}

module.exports = {
    gameDataWithMoreEncounterDetail,
    validBoard,
    validEncounter,
    validEncounterWithInitialUnit,
    validGame,
    validGameEvent: validAddUnitGameEvent,
    validScenario,
    validUnit
};
