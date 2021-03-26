export function ListScenarios({scenarioRepository}) {
    return async function ListScenarios() {
        return await scenarioRepository.list();
    }
}
