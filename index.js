const { runDupRemover } = require("./src/app/dupRemover");
const mockFilePath = "assets/mocks/mock_application.json";
const newFilePath = "results/app/clean_application.json";

runDupRemover(mockFilePath, newFilePath);
