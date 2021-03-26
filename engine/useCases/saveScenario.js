import {generateId} from "../util.js";

export function SaveScenario({scenarioRepository}) {
    return async function SaveScenario(scenarioData) {

        if (typeof scenarioData.id !== 'string') {
            scenarioData.id = generateId('Scenario', scenarioData.name);
        }

        await scenarioRepository.save(scenarioData);

        return {
            success: true,
            scenarioId: scenarioData.id
        };
    }
}
