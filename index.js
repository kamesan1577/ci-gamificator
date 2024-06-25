const core = require('@actions/core');
const artifact = require('@actions/artifact');
const fs = require('fs');
const path = require('path');

async function run() {
    try {
        const artifactName = core.getInput('artifact-name');
        const artifactClient = new artifact.DefaultArtifactClient();
        const downloadResponse = await artifactClient.downloadArtifact(artifactName);
        const filePath = path.join(downloadResponse.downloadPath, 'jest-results.json');

        if (fs.existsSync(filePath)) {
            const testResults = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            console.log('Jest Test Results:', testResults);
            // Add additional processing of test results here
        } else {
            core.setFailed('Test results file not found');
        }
    } catch (error) {
        core.setFailed(`Action failed with error ${error}`);
    }
}

run();
