/**
 * This file mocks production collections.
 * This file mocks client authentication functions to allow signing in other users in tests.
 * Firestore rules will only allow a signed in user with an uid equal to the saved uid in the test
 * collections document to use those test collections. But firestore rules will
 * validate the rules as if a user with uid stored in mocked functions was signed in.
 * When a user is signed into mocked functions, those mocked functions will return that
 * user's document, instead of the real signed in user.
 * This allows faster users creation and signing in.
 */

jest.mock<typeof import("common/db/collections.firebase")>("common/db/collections.firebase");
jest.mock<typeof import("common/db/auth.firebase")>("common/db/auth.firebase");

jest.mock<typeof import("backend/db/adminCollections.firebase")>(
  "backend/db/adminCollections.firebase"
);

jest.mock<typeof import("client_api/utils/fetchApi.util")>("client_api/utils/fetchApi.util");

import "cross-fetch/polyfill";
// Allows using admin/backend firestore when using jest-environment-jsdom
import "setimmediate";
// Fixes typia error where TextEncoder is not defined
import { TextDecoder, TextEncoder } from 'node:util'
Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
})