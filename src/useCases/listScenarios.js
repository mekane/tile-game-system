const Scenario = require('../entities/Scenario');

function ListScenarios({scenarioRepository}) {
    return async function ListScenarios() {
        const scenarioData = await scenarioRepository.list();
        return scenarioData.map(Scenario);
    }
}

module.exports = {
    ListScenarios
};
