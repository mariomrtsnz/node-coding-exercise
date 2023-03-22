const fs = require("fs");
const dupRemover = require("../app/dupRemover.js");
const utils = require("../app/utils.js");
const mockFilePath = "assets/mocks/mock_application.json";

describe("Knack Application Schema Sanitizer", () => {
  test("readFileAndParseJson should read and return a JSON object from a filepath with the correct schema", () => {
    const mockApp = utils.readFileAndParseJson(mockFilePath);
    expect(mockApp).toBeDefined();
    expect(mockApp.versions).toBeDefined();
    expect(mockApp.versions[0].objects).toBeDefined();
    expect(mockApp.versions[0].scenes).toBeDefined();
  });

  test("readFileAndParseJson should fail on wrong path", () => {
    const mockApp = utils.readFileAndParseJson(null);
    expect(mockApp).toBeUndefined();
  });

  test("removeDuplicates should accept empty arrays", () => {
    const res = dupRemover.removeDuplicates("key");
    expect(res).toBeDefined();
    expect(res).toEqual([]);
  });

  test("removeDuplicates should fail on second parameter type different than array", () => {
    const res = dupRemover.removeDuplicates("key", "stringInsteadOfArr");
    expect(res).toBeUndefined();
  });

  test("removeDuplicates should remove duplicate objects from an array based on a given property name", () => {
    const arr = [
      { key: "1", value: "a" },
      { key: "2", value: "b" },
      { key: "1", value: "c" },
    ];
    const res = dupRemover.removeDuplicates("key", arr);
    expect(res).toEqual([
      { key: "1", value: "a" },
      { key: "2", value: "b" },
    ]);
  });

  test("removeDuplicates should remove duplicate objects from an array and a subarray based on a given property name and subproperty name", () => {
    const arr = [
      {
        key: "1",
        value: "a",
        fields: [
          { keyId: "1", value: "a" },
          { keyId: "2", value: "b" },
          { keyId: "1", value: "c" },
        ],
      },
      {
        key: "2",
        value: "b",
        fields: [
          { keyId: "1", value: "a" },
          { keyId: "2", value: "b" },
          { keyId: "3", value: "c" },
        ],
      },
      {
        key: "1",
        value: "c",
        fields: [
          { keyId: "1", value: "a" },
          { keyId: "2", value: "b" },
          { keyId: "3", value: "c" },
        ],
      },
    ];
    const res = dupRemover.removeDuplicates("key", arr, "fields", "keyId");
    expect(res).toEqual([
      {
        key: "1",
        value: "a",
        fields: [
          { keyId: "1", value: "a" },
          { keyId: "2", value: "b" },
        ],
      },
      {
        key: "2",
        value: "b",
        fields: [
          { keyId: "1", value: "a" },
          { keyId: "2", value: "b" },
          { keyId: "3", value: "c" },
        ],
      },
    ]);
  });

  test("runDupRemover should remove duplicate objects given a filepath, and a new filepath where the sanitized file will be found", () => {
    const newFilePath = "results/test/test_clean_application.json";
    const wrongMockFilePath = "assets/mocks/test_mock_application.json";
    const cleanMockFilePath = "assets/mocks/test_clean_mock_application.json";

    dupRemover.runDupRemover(wrongMockFilePath, newFilePath);
    const cleanMockObj = utils.readFileAndParseJson(cleanMockFilePath);
    const cleanTestObj = utils.readFileAndParseJson(newFilePath);
    expect(cleanTestObj).toEqual(cleanMockObj);
  });

  test("runDupRemover should fail to remove duplicate objects given a wrong obj", () => {
    const wrongMockFilePath = "assets/mocks/wrong_mock_application.json";
    const newFilePath = "results/test/test_clean_application_2.json";
    dupRemover.runDupRemover(wrongMockFilePath, newFilePath);
    const cleanTestObj = utils.readFileAndParseJson(newFilePath);
    expect(cleanTestObj).toBeUndefined();
  });

  test("runDupRemover should fail to remove duplicate objects given an incomplete obj", () => {
    const wrongMockFilePath = "assets/mocks/wrong_mock_application_2.json";
    const newFilePath = "results/test/test_clean_application_3.json";
    dupRemover.runDupRemover(wrongMockFilePath, newFilePath);
    const cleanTestObj = utils.readFileAndParseJson(newFilePath);
    expect(cleanTestObj).toBeDefined();
    expect(cleanTestObj.versions).toBeDefined();
    expect(cleanTestObj.versions[0].scenes).toBeDefined();
    expect(cleanTestObj.versions[0].objects).toBeDefined();
    expect(cleanTestObj.versions[0].scenes[0]).toBeUndefined();
    expect(cleanTestObj.versions[0].objects[0]).toBeUndefined();
  });

  test("jsonStringifyAndWriteFile should stringify an object as JSON and create a new file from the data", () => {
    const obj = {
      versions: [
        {
          objects: [
            {
              key: "testObj1",
              value: "a",
              fields: [
                { key: "testObj1Field1", value: "a" },
                { key: "testObj1Field2", value: "b" },
              ],
            },
          ],
          scenes: [
            {
              key: "testScene1",
              value: "a",
              fields: [
                { key: "testScene1View1", value: "a" },
                { key: "testScene1View2", value: "b" },
              ],
            },
          ],
        },
      ],
    };
    const testFilePath = "results/test/jsonStringifyAndWriteFile.json";
    utils.jsonStringifyAndWriteFile(obj, testFilePath);
    expect(fs.existsSync(testFilePath)).toBe(true);
  });

  test("jsonStringifyAndWriteFile should fail on wrong path", () => {
    const obj = {
      versions: [
        {
          objects: [
            {
              key: "testObj1",
              value: "a",
              fields: [
                { key: "testObj1Field1", value: "a" },
                { key: "testObj1Field2", value: "b" },
              ],
            },
          ],
          scenes: [
            {
              key: "testScene1",
              value: "a",
              fields: [
                { key: "testScene1View1", value: "a" },
                { key: "testScene1View2", value: "b" },
              ],
            },
          ],
        },
      ],
    };
    const testFilePath = null;
    utils.jsonStringifyAndWriteFile(obj, testFilePath);
    expect(fs.existsSync(testFilePath)).toBe(false);
  });

  // This is optional to clean the files created during tests, remove if necessary to check the generated files.
  afterAll(() => {
    const dirPath = "results/test";
    fs.readdirSync(dirPath).forEach((filePath) =>
      fs.rm(`${dirPath}/${filePath}`, () => {})
    );
  });
});
