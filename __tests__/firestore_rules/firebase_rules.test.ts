// import firebase from "@firebase/testing";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc } from "firebase/firestore";

describe("Firestore rules", () => {
  it("asserts Alice can read project", async () => {
    let testEnv = await initializeTestEnvironment({});
    const alice = testEnv.authenticatedContext("alice");
    const docRef = doc(alice.firestore(), "projects", "first-project");
    await assertSucceeds(getDoc(docRef));
    await testEnv.cleanup();
  });
});
