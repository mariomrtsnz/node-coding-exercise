const utils = require("./utils.js");

/**
 * It takes a key to compare, an array of objects, and optionally a sub-array name and sub-array key to
 * compare, and returns a new array of objects with duplicates removed.
 *
 * The main logic first creates a copy to not modify the original array, then it keeps track of the
 * unique values of the given objKey for each object in the given array using a Set.
 * It then uses the filter method to generate a new array that contains only objects whose property
 * values have not yet been added to the Set. If multiple objects have the same property value,
 * only the first one will be included in the resulting array.
 *
 * @param objKey - The key of the object that you want to remove duplicates from.
 * @param [arr] - The array to remove duplicates from.
 * @param [subArrName] - The name of the sub array that you want to remove duplicates from. Optional.
 * @param [subArrObjKey] - The key of the object in the sub array that you want to use to remove. Optional.
 * duplicates.
 * @returns An array of unique values.
 */
const removeDuplicates = (
  objKey,
  arr = [],
  subArrName = null,
  subArrObjKey = null
) => {
  try {
    const arrCopy = JSON.parse(JSON.stringify(arr));
    const set = new Set();
    const uniqueValues = arrCopy.filter((element) => {
      if (!set.has(element[objKey])) {
        set.add(element[objKey]);
        return true;
      }
      return false;
    });

    if (subArrName && subArrObjKey) {
      uniqueValues.forEach((element) => {
        element[subArrName] = removeDuplicates(
          subArrObjKey,
          element[subArrName]
        );
      });
    }

    return uniqueValues;
  } catch (error) {
    console.error(`Error removing duplicates: ${error}`);
  }
};

/**
 * It takes a mock file path and a new file path, reads the mock file, removes duplicate objects,
 * scenes, fields and views and writes the new file.
 * @param mockFilePath - The path to the mock file you want to clean up.
 * @param newFilePath - The path to the new file that will be created.
 */
const runDupRemover = (mockFilePath, newFilePath) => {
  try {
    const jsonMockData = utils.readFileAndParseJson(mockFilePath);

    if (jsonMockData) {
      const originalObjects = jsonMockData?.versions?.[0]?.objects || [];
      const originalScenes = jsonMockData?.versions?.[0]?.scenes || [];

      const cleanObjects = removeDuplicates(
        "key",
        originalObjects,
        "fields",
        "key"
      );
      const cleanScenes = removeDuplicates(
        "key",
        originalScenes,
        "views",
        "key"
      );

      const cleanMockData = {
        ...jsonMockData,
        versions: [
          {
            ...jsonMockData?.versions?.[0],
            objects: cleanObjects,
            scenes: cleanScenes,
          },
        ],
      };

      utils.jsonStringifyAndWriteFile(cleanMockData, newFilePath);
    }
  } catch (error) {
    console.error(`There was an error with the main process: ${error}`);
  }
};

module.exports = {
  removeDuplicates,
  runDupRemover,
};
