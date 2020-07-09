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

function validGame() {
    return {
        name: 'Test',
        scenario: validScenario(),
        currentEncounterIndex: 0
    }
}

function validGameAction() {
    return {
        action: 'moveUnit',
        unitIndex: 0,
        direction: 'e'
    }
}

function validScenario() {
    return {
        name: 'Test',
        encounters: [
            validEncounter(),
            validEncounter()
        ]
    }
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
