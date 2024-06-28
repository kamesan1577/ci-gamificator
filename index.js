const core = require('@actions/core');
const artifact = require('@actions/artifact');
const fs = require('fs');
const path = require('path');

async function run() {
    try {
        const artifactName = core.getInput("artifact-name");
        const artifactClient = new artifact.DefaultArtifactClient();
        const downloadPath = path.join(process.cwd(), 'downloaded-artifact');

        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath);
        }

        console.log(`Downloading artifact ${artifactName} to ${downloadPath}`);
        const downloadResponse = await artifactClient.downloadArtifact(artifactName, downloadPath);
        const filePath = path.join(downloadResponse.downloadPath, 'jest-results.json');
        console.log(`Reading file: ${filePath}`)

        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf8");
            console.log(`File content: ${data}`);
            const jsonData = JSON.parse(data);
            console.log(`Parsed JSON: ${jsonData}`);
            console.log(jsonData);
        } else {
            console.log(`File not found: ${filePath}`)
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();
