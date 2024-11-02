const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const { createCoverageMap } = require('istanbul-lib-coverage');
const customReporter = require('./customreporter');

module.exports = async () => {
    const coverageFile = path.join(__dirname, 'coverage', 'coverage-final.json');
    const failedTestsFile = path.join(__dirname, 'failed-tests.json');
    if (fs.existsSync(coverageFile)) {
        const coverageData = JSON.parse(fs.readFileSync(coverageFile));
        const coverageMap = createCoverageMap(coverageData);

        const failedTests = JSON.parse(fs.readFileSync(failedTestsFile));
        failedTests.forEach(failedTest => {
            const coveredFiles = [];
            for (const [file, coverage] of Object.entries(coverageMap.data)) {
                const fileCoverage = coverage.s;
                const coveredLines = Object.entries(fileCoverage)
                    .filter(([, hits]) => hits > 0)
                    .map(([line]) => Number(line));

                coveredFiles.push({ file, coveredLines });
            }

            failedTest.coveredFiles = coveredFiles;
        });

        const commitHash = execSync('git rev-parse HEAD').toString().trim();

        console.log(JSON.stringify({ commitHash, failedTests }, null, 2));
    }
}
