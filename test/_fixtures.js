function validBoard() {
    return {
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
        scenario: validScenario()
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
        name: 'Test',
        movement: 6
    }
}

module.exports = {
    validBoard,
    validCharacter,
    validEncounter,
    validGame,
    validScenario,
    validUnit
};
