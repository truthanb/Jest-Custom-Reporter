# Jest Custom Reporter

This project demonstrates a custom Jest reporter that collects information about failed tests and their coverage.

## Setup

1. Install dependencies:
    ```sh
    npm install
    ```

## Running Tests

To run the tests, use the following command:
```sh
npm test --coverage
```

## Expected Output Should Include Something Like:
```
Ran all test suites.
{
  "commitHash": "167e3a17ed51680ec19c9cff263bb99ca7e250e9",
  "failedTests": [
    {
      "testFile": "/mnt/c/Users/Ben/Documents/GitHub/Jest-Custom-Reporter/function.test.js",
      "testName": "adds 1 + 2 to equal 4, doh!",
      "duration": 7,
      "coveredFiles": [
        {
          "file": "/mnt/c/Users/Ben/Documents/GitHub/Jest-Custom-Reporter/function.js",
          "coveredLines": [
            0,
            1,
            2,
            3
          ]
        }
      ]
    }
  ]
}
```