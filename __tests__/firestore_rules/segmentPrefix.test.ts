import {
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestContext,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import DEV_PROJECT_ID from "common/constants/devProjectId";
import { doc, Firestore, getDoc } from "firebase/firestore";

describe("Segment prefix", () => {
  let testEnv: RulesTestEnvironment;
  let myAuthContext: RulesTestContext;
  let myDb: Firestore;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({ projectId: DEV_PROJECT_ID });
    myAuthContext = testEnv.authenticatedContext("me@normkeeper-testing.rules");
    myDb = myAuthContext.firestore() as unknown as Firestore;
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it("can read from test collection with segment prefix", async () => {
    const docRef = doc(myDb, "2023-01-09col/2023-01-09doc/projects", "first-project");
    await assertSucceeds(getDoc(docRef));
  });

  it("can read from test collection without segment prefix", async () => {
    const docRef = doc(myDb, "projects", "first-project");
    await assertSucceeds(getDoc(docRef));
  });
});
