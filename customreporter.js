const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

class CustomReporter {
    constructor(globalConfig, options) {
        this.globalConfig = globalConfig;
        this.options = options;
        this.failedTests = [];
    }

    onTestResult(test, testResult) {
        if (!testResult.testResults.some(result => result.status === 'failed')) return;

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
        const failedTestsFile = path.join(this.globalConfig.rootDir, 'failed-tests.json');
        fs.writeFileSync(failedTestsFile, JSON.stringify(this.failedTests, null, 2));
    }
}

module.exports = CustomReporter;