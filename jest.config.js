// jest.config.js
const nextJest = require("next/jest");
const { v4: uuidv4 } = require("uuid");

process.env.TEST_COLLECTIONS_ID = uuidv4();

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  globalSetup: "<rootDir>/__tests__/globalSetup.ts",
  globalTeardown: "<rootDir>/__tests__/globalTeardown.ts",
  setupFilesAfterEnv: ["jest-extended/all"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "node",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
