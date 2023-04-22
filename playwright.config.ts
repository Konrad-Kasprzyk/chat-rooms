require("dotenv").config();
import { PlaywrightTestConfig, devices } from "@playwright/test";
import path from "path";
import APP_URL from "./global/constants/url";

let serverURL: string | null;
switch (process.env.REMOTE_SERVER) {
  case "preview": {
    serverURL = APP_URL;
    break;
  }
  case "production": {
    serverURL = APP_URL;
    break;
  }
  default: {
    serverURL = null;
    break;
  }
}

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = serverURL === null ? `http://127.0.0.1:${PORT}` : serverURL;

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  // globalSetup: require.resolve("./e2e/global-setup"),
  // Timeout per test
  timeout: 30 * 1000,
  // Test directory
  testDir: path.join(__dirname, "e2e"),
  // If a test fails, retry it additional 2 times
  retries: 2,
  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir: "test-results/",

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  webServer: process.env.REMOTE_SERVER
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
      },

  use: {
    // Use baseURL so to make navigations relative.
    // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
    baseURL,

    // Retry a test if its failing with enabled tracing. This allows you to analyse the DOM, console logs, network traffic etc.
    // More information: https://playwright.dev/docs/trace-viewer
    trace: "retry-with-trace",

    // All available context options: https://playwright.dev/docs/api/class-browser#browser-new-context
    // contextOptions: {
    //   ignoreHTTPSErrors: true,
    // },
  },

  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    // {
    //   name: 'Desktop Firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },
    // {
    //   name: 'Desktop Safari',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    // },
    // Test against mobile viewports.
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
      },
    },
    {
      name: "Mobile Safari",
      use: devices["iPhone 12"],
    },
  ],
};
export default config;
