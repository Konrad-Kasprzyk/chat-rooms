// import firebase from "@firebase/testing";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc } from "firebase/firestore";

describe("segment prefix", () => {
  it("can read from test collection with segment prefix", async () => {
    let testEnv = await initializeTestEnvironment({
      projectId: "normkeeper-dev",
      firestore: { host: "127.0.0.1", port: 8088 },
    });
    const alice = testEnv.authenticatedContext("foo@normkeeper-testing.rules");
    const docRef = doc(alice.firestore(), "2022-12-21col/2022-12-21doc/projects", "first-project");
    await assertSucceeds(getDoc(docRef));
    await testEnv.cleanup();
  });

  it("can read from test collection without segment prefix", async () => {
    let testEnv = await initializeTestEnvironment({
      projectId: "normkeeper-dev",
      firestore: { host: "127.0.0.1", port: 8088 },
    });
    const alice = testEnv.authenticatedContext("alice");
    const docRef = doc(alice.firestore(), "projects", "first-project");
    await assertSucceeds(getDoc(docRef));
    await testEnv.cleanup();
  });
});
