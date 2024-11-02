const fs = require('fs');
const { execSync } = require('child_process');
const { CoverageMap, createCoverageMap } = require('istanbul-lib-coverage');

class CustomReporter {
    constructor(globalConfig, options) {
        this.globalConfig = globalConfig;
        this.options = options;
        this.failedTests = [];
    }

    onTestResult(test, testResult) {
        if (!testResult.testResults.some(result => result.status === 'failed')) return;

        // Collect failed tests
        testResult.testResults.forEach(result => {
            if (result.status === 'failed') {
                this.failedTests.push({
                    testFile: testResult.testFilePath,
                    testName: result.fullName,
                    duration: result.duration,
                });
            }
        });
    }

    async getCommitHash() {
        try {
            return execSync('git rev-parse HEAD').toString().trim();
        } catch (error) {
            console.error('Error getting commit hash:', error);
            return null;
        }
    }

    async onRunComplete() {
        const coverageFile = './coverage/coverage-final.json'; // Adjust as needed
        if (fs.existsSync(coverageFile)) {
            const coverageData = JSON.parse(fs.readFileSync(coverageFile));
            const coverageMap = createCoverageMap(coverageData);

            // Process each failed test
            this.failedTests = this.failedTests.map(failedTest => {
                const coveredFiles = [];

                // Get file and line coverage for each failed test
                for (const [file, coverage] of Object.entries(coverageMap.data)) {
                    const fileCoverage = coverage.s;
                    const coveredLines = Object.entries(fileCoverage)
                        .filter(([, hits]) => hits > 0)
                        .map(([line]) => Number(line));

                    coveredFiles.push({ file, coveredLines });
                }

                return { ...failedTest, coveredFiles };
            });

            const commitHash = await this.getCommitHash();

    this.sendBatch({ commitHash, failedTests: this.failedTests });
        }
    }

    sendBatch(failedTests) {
        // Implement logic to send the `failedTests` batch to your service
        console.log(JSON.stringify({ failedTests }, null, 2));
    }
}

module.exports = CustomReporter;