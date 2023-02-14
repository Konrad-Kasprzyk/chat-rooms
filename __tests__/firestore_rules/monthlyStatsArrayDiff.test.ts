import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestContext,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  addDoc,
  collection,
  Firestore,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import collections from "../../global/constants/collections";
import devProjectId from "../../global/constants/devProjectId";
import HEX_CHARS from "../../global/constants/hexChars";
import StatsChunk from "../../global/models/statsChunk.model";

describe("Create read and update statsChunks collection", () => {
  let testEnv: RulesTestEnvironment;
  let myAuthContext: RulesTestContext;
  let myDb: Firestore;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({ projectId: devProjectId });
    myAuthContext = testEnv.authenticatedContext("me");
    myDb = myAuthContext.firestore() as unknown as Firestore;
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it("accept array union with one proper item", async () => {
    let statsChunk: StatsChunk = {
      id: "",
      projectId: "foo",
      earliestTaskDate: serverTimestamp() as Timestamp,
      finishedTasks: [
        {
          day: Timestamp.now(),
          goalId: "foo",
          typeShortId: HEX_CHARS,
          assignedUserId: "foo",
          storyPoints: 2,
        },
      ],
    };
    const statsChunkRef = await assertSucceeds(
      addDoc(collection(myDb, collections.statsChunks), statsChunk)
    );
    const statsChunkSnap = await assertSucceeds(getDoc(statsChunkRef));
    statsChunk = statsChunkSnap.data() as StatsChunk;
    statsChunk.finishedTasks.push({
      day: Timestamp.now(),
      goalId: "bar",
      typeShortId: HEX_CHARS,
      assignedUserId: "bar",
      storyPoints: 11,
    });
    await assertSucceeds(
      updateDoc(statsChunkRef, {
        finishedTasks: statsChunk.finishedTasks,
      })
    );
  });

  it("forbids array change beside proper array union", async () => {
    let statsChunk: StatsChunk = {
      id: "",
      projectId: "foo",
      earliestTaskDate: serverTimestamp() as Timestamp,
      finishedTasks: [
        {
          day: Timestamp.now(),
          goalId: "foo",
          typeShortId: HEX_CHARS,
          assignedUserId: "foo",
          storyPoints: 2,
        },
      ],
    };
    const statsChunkRef = await assertSucceeds(
      addDoc(collection(myDb, collections.statsChunks), statsChunk)
    );
    const statsChunkSnap = await assertSucceeds(getDoc(statsChunkRef));
    statsChunk = statsChunkSnap.data() as StatsChunk;
    statsChunk.finishedTasks.push({
      day: Timestamp.now(),
      goalId: "bar",
      typeShortId: HEX_CHARS,
      assignedUserId: "bar",
      storyPoints: 11,
    });
    await assertSucceeds(
      updateDoc(statsChunkRef, {
        finishedTasks: statsChunk.finishedTasks,
      })
    );

    statsChunk.finishedTasks.push({
      day: Timestamp.now(),
      goalId: "baz",
      typeShortId: HEX_CHARS,
      assignedUserId: "baz",
      storyPoints: 13,
    });
    statsChunk.finishedTasks[0].storyPoints = 10;
    await assertFails(
      updateDoc(statsChunkRef, {
        finishedTasks: statsChunk.finishedTasks,
      })
    );
  });
});
