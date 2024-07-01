const core = require('@actions/core');
const artifact = require('@actions/artifact');
const fs = require('fs');
const path = require('path');

async function run() {
    try {
        const artifactId = core.getInput("artifact-id");
        const contributor = core.getInput("contributor");
        const artifactClient = new artifact.DefaultArtifactClient();
        const downloadPath = path.join(process.cwd(), 'downloaded-artifact');

        const apiUrl = "www.example.com"

        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath);
        }

        console.log(`Downloading artifact ${artifactId} to ${downloadPath}`);
        const downloadResponse = await artifactClient.downloadArtifact(artifactId, downloadPath);
        const filePath = path.join(downloadResponse.downloadPath, 'jest-results.json');
        console.log(`Reading file: ${filePath}`)

        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf8");
            console.log(`File content: ${data}`);
            const jsonData = JSON.parse(data);
            console.log(`Parsed JSON: ${jsonData}`);
            console.log(jsonData);

            const payload = {
                artifactId: artifactId,
                contributor: contributor,
                apiUrl: apiUrl,
                jsonData: jsonData,
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            console.log(`API response: ${response.status}`);
        }
        else {
            console.log(`File not found: ${filePath}`)
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();
