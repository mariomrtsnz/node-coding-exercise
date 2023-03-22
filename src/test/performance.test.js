const fs = require("fs");
const { performance } = require("perf_hooks");
const { runDupRemover } = require("../app/dupRemover.js");

describe("Performance Tests", () => {
  test("runDupRemover should run under 10ms with a minimal test case", () => {
    const start = performance.now();
    const newFilePath = "results/test/test_clean_application.json";
    const wrongMockFilePath = "assets/mocks/test_mock_application.json";

    runDupRemover(wrongMockFilePath, newFilePath);

    const end = performance.now();
    const duration = end - start;
    expect(duration).toBeLessThan(10);
  });

  // This is optional to clean the files created during tests, remove if necessary to check the generated files.
  afterAll(() => {
    const dirPath = "results/test";
    fs.readdirSync(dirPath).forEach((filePath) =>
      fs.rm(`${dirPath}/${filePath}`, () => {})
    );
  });
});
