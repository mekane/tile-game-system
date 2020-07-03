const Game = require('../entities/Game');

function init({scenarioRepository}) {
    return function NewGame({name = '', scenarioId} = {}) {
        return Game({
            name,
            scenario: scenarioRepository.getScenario(scenarioId)
        });
    }
}

module.exports = init;
