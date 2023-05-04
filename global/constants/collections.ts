import type Collections from "../types/collections";
import getTestSubcollections from "../utils/test_utils/getTestSubcollections";

let _collections: Collections = {
  completedTaskStats: "completedTaskStats",
  counters: "counters",
  goals: "goals",
  goalHistories: "goalHistories",
  norms: "norms",
  normHistories: "normHistories",
  tasks: "tasks",
  taskHistories: "taskHistories",
  TestUsersAndSubcollections: "TestUsersAndSubcollections",
  users: "users",
  workspaces: "workspaces",
  workspaceUrls: "workspaceUrls",
  workspaceHistories: "workspaceHistories",
};

if (process.env.NODE_ENV === "test") {
  const testCollectionsId = process.env.TEST_COLLECTIONS_ID;
  if (!testCollectionsId)
    throw (
      "process.env.TEST_COLLECTIONS_ID is undefined. " +
      "Environment variable should be set in tests framework config, before global setup is run. " +
      "Cannot run tests on production collections."
    );
  _collections = getTestSubcollections(_collections, testCollectionsId);
}

const COLLECTIONS: Collections = _collections;

export default COLLECTIONS;
