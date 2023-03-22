const fs = require("fs");

/**
 * Read a file and parse it as JSON.
 * @param filePath - The path to the file you want to read and parse.
 * @returns the parsed JSON data.
 */
const readFileAndParseJson = (filePath) => {
  try {
    const jsonMockData = JSON.parse(fs.readFileSync(filePath));
    return jsonMockData;
  } catch (error) {
    console.error(`Error reading and parsing JSON: ${error}`);
  }
};

/**
 * Stringifies an object into JSON format and writes a new file to the given newFilePath.
 * @param data - The object to convert to JSON string.
 * @param newFilePath - The path to where the new file will be created.
 */
const jsonStringifyAndWriteFile = (data, newFilePath) => {
  try {
    fs.writeFileSync(newFilePath, JSON.stringify(data));
  } catch (error) {
    console.error(`Error stringifying and writing JSON to new file: ${error}`);
  }
};

module.exports = {
  readFileAndParseJson,
  jsonStringifyAndWriteFile,
};
