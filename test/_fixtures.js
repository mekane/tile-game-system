let unitId = 0;

export function validBoard() {
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

export function validEncounter(overrides) {
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

export function validEncounterWithInitialUnit(overrides) {
    const encounterWithInit = validEncounter({
        name: 'Test Encounter With Initial Unit',
        init: [
            validGameAction()
        ]
    });
    return Object.assign(encounterWithInit, overrides);
}

export function validGame(overrides) {
    return Object.assign({
        name: 'Test',
        scenario: validScenario(),
        currentEncounterIndex: 0
    }, overrides);
}

export function validGameAction() {
    return {
        action: 'addUnit',
        unitName: 'Goblin',
        boardX: 0,
        boardY: 0,
    }
}

export function validScenario(overrides) {
    return Object.assign({
        name: 'Test',
        encounters: [
            validEncounter(),
            validEncounter()
        ]
    }, overrides);
}

export function validUnit() {
    return {
        id: 'Unit_' + unitId++,
        name: 'Goblin',
        movement: 6,
        turnOrder: 1
    }
}
