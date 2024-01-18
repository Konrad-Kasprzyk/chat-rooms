/**
 * Runs once before each test file.
 * This file mocks production collections and client authentication functions.
 * Firestore rules will be validated as if a user with a uid stored in the test
 * collection is signed in, when in fact no user is signed in.
 */
import DEFAULT_TIMEOUT from "./constants/defaultTimeout";

jest.mock<typeof import("common/db/collections.firebase")>("common/db/collections.firebase");
jest.mock<typeof import("common/db/auth.firebase")>("common/db/auth.firebase");

jest.mock<typeof import("backend/db/adminCollections.firebase")>(
  "backend/db/adminCollections.firebase"
);

jest.mock<typeof import("clientApi/utils/apiRequest/fetchApi.util")>(
  "clientApi/utils/apiRequest/fetchApi.util"
);

import "cross-fetch/polyfill";
// Allows using admin/backend firestore when using jest-environment-jsdom
import "setimmediate";
// Fixes typia error where TextEncoder is not defined
import { TextDecoder, TextEncoder } from "node:util";
Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
});

// Set default timeout for all tests
jest.setTimeout(DEFAULT_TIMEOUT);
