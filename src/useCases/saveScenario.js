const Scenario = require('../entities/Scenario');

function SaveScenarioUseCase({scenarioRepository}) {
    return async function SaveScenario(scenarioData) {

        if (typeof scenarioData.id !== 'string') {
            const tempScenario = Scenario(scenarioData);
            scenarioData.id = tempScenario.getId();
        }

        await scenarioRepository.save(scenarioData);

        return {
            success: true,
            scenarioId: scenarioData.id
        };
    }
}

module.exports = SaveScenarioUseCase;
