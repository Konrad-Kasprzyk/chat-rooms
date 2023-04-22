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
import DEV_PROJECT_ID from "../../global/constants/devProjectId";
import CompletedTaskStats from "../../global/models/completedTaskStats.model";

describe("Create read and update statsChunks collection", () => {
  let testEnv: RulesTestEnvironment;
  let myAuthContext: RulesTestContext;
  let myDb: Firestore;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({ projectId: DEV_PROJECT_ID });
    myAuthContext = testEnv.authenticatedContext("me");
    myDb = myAuthContext.firestore() as unknown as Firestore;
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it("accept array union with one proper item", async () => {
    let statsChunk: CompletedTaskStats = {
      id: "",
      projectId: "foo",
      earliestTaskDate: serverTimestamp() as Timestamp,
      taskStats: [
        {
          day: Timestamp.now(),
          goalId: "foo",
          typeShortId: 1,
          assignedUserId: "foo",
          storyPoints: 2,
        },
      ],
    };
    const statsChunkRef = await assertSucceeds(
      addDoc(collection(myDb, collections.statsChunks), statsChunk)
    );
    const statsChunkSnap = await assertSucceeds(getDoc(statsChunkRef));
    statsChunk = statsChunkSnap.data() as CompletedTaskStats;
    statsChunk.taskStats.push({
      day: Timestamp.now(),
      goalId: "bar",
      typeShortId: 1,
      assignedUserId: "bar",
      storyPoints: 11,
    });
    await assertSucceeds(
      updateDoc(statsChunkRef, {
        finishedTasks: statsChunk.taskStats,
      })
    );
  });

  it("forbids array change beside proper array union", async () => {
    let statsChunk: CompletedTaskStats = {
      id: "",
      projectId: "foo",
      earliestTaskDate: serverTimestamp() as Timestamp,
      taskStats: [
        {
          day: Timestamp.now(),
          goalId: "foo",
          typeShortId: 1,
          assignedUserId: "foo",
          storyPoints: 2,
        },
      ],
    };
    const statsChunkRef = await assertSucceeds(
      addDoc(collection(myDb, collections.statsChunks), statsChunk)
    );
    const statsChunkSnap = await assertSucceeds(getDoc(statsChunkRef));
    statsChunk = statsChunkSnap.data() as CompletedTaskStats;
    statsChunk.taskStats.push({
      day: Timestamp.now(),
      goalId: "bar",
      typeShortId: 1,
      assignedUserId: "bar",
      storyPoints: 11,
    });
    await assertSucceeds(
      updateDoc(statsChunkRef, {
        finishedTasks: statsChunk.taskStats,
      })
    );

    statsChunk.taskStats.push({
      day: Timestamp.now(),
      goalId: "baz",
      typeShortId: 1,
      assignedUserId: "baz",
      storyPoints: 13,
    });
    statsChunk.taskStats[0].storyPoints = 10;
    await assertFails(
      updateDoc(statsChunkRef, {
        finishedTasks: statsChunk.taskStats,
      })
    );
  });
});
