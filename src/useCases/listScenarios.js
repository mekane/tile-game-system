const Scenario = require('../entities/Scenario');

function ListScenarios({scenarioRepository}) {
    return async function ListScenarios() {
        return await scenarioRepository.list();
    }
}

module.exports = {
    ListScenarios
};
