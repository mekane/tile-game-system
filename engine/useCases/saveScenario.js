const util = require('../util.js');

function SaveScenario({scenarioRepository}) {
    return async function SaveScenario(scenarioData) {

        if (typeof scenarioData.id !== 'string') {
            scenarioData.id = util.generateId('Scenario', scenarioData.name);
        }

        await scenarioRepository.save(scenarioData);

        return {
            success: true,
            scenarioId: scenarioData.id
        };
    }
}

module.exports = {
    SaveScenario
};
