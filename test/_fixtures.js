function validBoard() {
    return {
        name: 'Test',
        tiles: [
            ['A', 'A', 'C'],
            ['C', 'A', 'B'],
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
                name: 'Hills',
                movementRequired: 2
            },
            D: {
                name: 'Stones',
                blocksMovement: true
            }
        }
    }
}

function validCharacter() {
    return {
        name: 'Test Character',
        strength: 12,
        dexterity: 9,
        constitution: 3,
        wisdom: 1,
        intelligence: 19,
        charisma: 16
    }
}

function validEncounter() {
    return {
        name: 'Test',
        description: 'A cool encounter',
        board: validBoard(),
        units: [
            validUnit(),
            validUnit()
        ]
    }
}

function validGame(overrides) {
    return Object.assign({
        name: 'Test',
        scenario: validScenario(),
        currentEncounterIndex: 0
    }, overrides);
}

function validGameAction() {
    return {
        action: 'addUnit',
        unitName: 'Goblin',
        boardX: 0,
        boardY: 0,
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
        name: 'Goblin',
        movement: 6
    }
}

module.exports = {
    validBoard,
    validCharacter,
    validEncounter,
    validGame,
    validGameAction,
    validScenario,
    validUnit
};
