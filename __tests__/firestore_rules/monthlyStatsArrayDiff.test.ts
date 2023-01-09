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
import MonthlyStats from "../../global/models/monthlyStats";

describe("Create read and update monthlyStats collection", () => {
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
    let monthlyStats: MonthlyStats = {
      id: "",
      projectId: "foo",
      month: serverTimestamp() as Timestamp,
      finishedTasks: [
        {
          day: Timestamp.now(),
          goals: [{ goalId: "foo", storyPoints: 42 }],
          types: [{ typeShortId: HEX_CHARS, storyPoints: 42 }],
          users: [{ assignedUserId: "foo", storyPoints: 42 }],
        },
      ],
    };
    const monthlyStatsRef = await assertSucceeds(
      addDoc(collection(myDb, collections.monthlyStats), monthlyStats)
    );
    const monthlyStatsSnap = await assertSucceeds(getDoc(monthlyStatsRef));
    monthlyStats = monthlyStatsSnap.data() as MonthlyStats;
    monthlyStats.finishedTasks.push({
      day: Timestamp.now(),
      goals: [{ goalId: "bar", storyPoints: 11 }],
      types: [{ typeShortId: HEX_CHARS, storyPoints: 11 }],
      users: [{ assignedUserId: "bar", storyPoints: 11 }],
    });
    await assertSucceeds(
      updateDoc(monthlyStatsRef, {
        month: serverTimestamp() as Timestamp,
        finishedTasks: monthlyStats.finishedTasks,
      })
    );
  });

  it("forbids array change beside proper array union", async () => {
    let monthlyStats: MonthlyStats = {
      id: "",
      projectId: "foo",
      month: serverTimestamp() as Timestamp,
      finishedTasks: [
        {
          day: Timestamp.now(),
          goals: [{ goalId: "foo", storyPoints: 42 }],
          types: [{ typeShortId: HEX_CHARS, storyPoints: 42 }],
          users: [{ assignedUserId: "foo", storyPoints: 42 }],
        },
      ],
    };
    const monthlyStatsRef = await assertSucceeds(
      addDoc(collection(myDb, collections.monthlyStats), monthlyStats)
    );
    const monthlyStatsSnap = await assertSucceeds(getDoc(monthlyStatsRef));
    monthlyStats = monthlyStatsSnap.data() as MonthlyStats;
    monthlyStats.finishedTasks.push({
      day: Timestamp.now(),
      goals: [{ goalId: "bar", storyPoints: 11 }],
      types: [{ typeShortId: HEX_CHARS, storyPoints: 11 }],
      users: [{ assignedUserId: "bar", storyPoints: 11 }],
    });
    await assertSucceeds(
      updateDoc(monthlyStatsRef, {
        month: serverTimestamp() as Timestamp,
        finishedTasks: monthlyStats.finishedTasks,
      })
    );
    monthlyStats.finishedTasks.push({
      day: Timestamp.now(),
      goals: [{ goalId: "baz", storyPoints: 13 }],
      types: [{ typeShortId: HEX_CHARS, storyPoints: 13 }],
      users: [{ assignedUserId: "baz", storyPoints: 13 }],
    });
    monthlyStats.finishedTasks[0].goals[0].storyPoints = 10;
    await assertFails(
      updateDoc(monthlyStatsRef, {
        month: serverTimestamp() as Timestamp,
        finishedTasks: monthlyStats.finishedTasks,
      })
    );
  });
});
