const Scenario = require('../entities/Scenario');

function ListScenariosUseCase({scenarioRepository}) {
    return async function ListScenarios() {
        const scenarioData = await scenarioRepository.list();
        return scenarioData.map(Scenario);
    }
}

module.exports = ListScenariosUseCase;
