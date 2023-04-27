import { adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../../global/constants/collections";
import {
  INIT_COUNTER_COLUMN_ID,
  INIT_COUNTER_GOAL_SEARCH_ID,
  INIT_COUNTER_GOAL_SHORT_ID,
  INIT_COUNTER_LABEL_ID,
  INIT_COUNTER_NORM_SEARCH_ID,
  INIT_COUNTER_TASK_SEARCH_ID,
  INIT_COUNTER_TASK_SHORT_ID,
  INIT_TASK_COLUMNS,
  INIT_TASK_LABELS,
} from "../../../global/constants/workspaceInitValues";
import User from "../../../global/models/user.model";
import Workspace from "../../../global/models/workspace.model";
import WorkspaceCounter from "../../../global/models/workspaceCounter.model";
import createUserModel from "../../../global/utils/admin_utils/createUserModel";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../../global/utils/admin_utils/emailPasswordUser";
import {
  createEmptyWorkspace,
  deleteWorkspaceAndRelatedDocuments,
  getRandomUrl,
} from "../../../global/utils/admin_utils/workspace";

const usedEmails: string[] = [];
const createdWorkspaces: string[] = [];

function getEmail() {
  const email = getUniqueEmail();
  usedEmails.push(email);
  return email;
}

describe("Test admin utils creating an empty workspace", () => {
  afterAll(async () => {
    const promises: Promise<any>[] = [];
    promises.push(deleteRegisteredUsersAndUserDocuments(usedEmails));
    for (const workspaceId of createdWorkspaces)
      promises.push(deleteWorkspaceAndRelatedDocuments(workspaceId));
    await Promise.all(promises);
  });

  it("Properly creates an empty workspace.", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const workspaceUrl = getRandomUrl();
    const title = "First project";
    const description = "description";
    const testing = true;
    const uid = await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);
    await createUserModel(uid, email, username);

    const workspaceId = await createEmptyWorkspace(uid, workspaceUrl, title, description, testing);
    createdWorkspaces.push(workspaceId);

    const userSnap = await adminDb.collection(COLLECTIONS.users).doc(uid).get();
    expect(userSnap.exists).toBeTrue();
    const user = userSnap.data() as User;
    expect(user.workspaces).toHaveLength(1);
    expect(user.workspaces[0].id).toEqual(workspaceId);
    expect(user.workspaces[0].title).toEqual(title);
    expect(user.workspaces[0].description).toEqual(description);
    const workspaceSnap = await adminDb.collection(COLLECTIONS.workspaces).doc(workspaceId).get();
    expect(workspaceSnap.exists).toBeTrue();
    const workspace = workspaceSnap.data() as Workspace;
    expect(workspace.id).toEqual(workspaceId);
    expect(workspace.url).toEqual(workspaceUrl);
    expect(workspace.title).toEqual(title);
    expect(workspace.description).toEqual(description);
    expect(workspace.testing).toEqual(testing);
    expect(workspace.counterId).toBeString();
    expect(workspace.userIds).toEqual([uid]);
    expect(workspace.invitedUserIds).toBeArrayOfSize(0);
    expect(workspace.columns).toEqual(INIT_TASK_COLUMNS);
    expect(workspace.labels).toEqual(INIT_TASK_LABELS);
    expect(workspace.hasItemsInBin).toBeFalse();
    expect(workspace.historyId).toBeEmpty();
    expect(workspace.placingInBinTime).toBeNull();
    expect(workspace.inRecycleBin).toBeFalse();
    expect(workspace.insertedIntoBinByUserId).toBeNull();
    const workspaceCounterSnap = await adminDb
      .collection(COLLECTIONS.counters)
      .doc(workspace.counterId)
      .get();
    expect(workspaceCounterSnap.exists).toBeTrue();
    const workspaceCounter = workspaceCounterSnap.data() as WorkspaceCounter;
    expect(workspaceCounter.workspaceId).toEqual(workspaceId);
    expect(workspaceCounter.nextTaskShortId).toEqual(INIT_COUNTER_TASK_SHORT_ID);
    expect(workspaceCounter.nextTaskSearchId).toEqual(INIT_COUNTER_TASK_SEARCH_ID);
    expect(workspaceCounter.nextLabelId).toEqual(INIT_COUNTER_LABEL_ID);
    expect(workspaceCounter.nextColumnId).toEqual(INIT_COUNTER_COLUMN_ID);
    expect(workspaceCounter.nextGoalShortId).toEqual(INIT_COUNTER_GOAL_SHORT_ID);
    expect(workspaceCounter.nextGoalSearchId).toEqual(INIT_COUNTER_GOAL_SEARCH_ID);
    expect(workspaceCounter.nextNormSearchId).toEqual(INIT_COUNTER_NORM_SEARCH_ID);
  });

  it("Throws error when workspace url is already taken.", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const workspaceUrl = getRandomUrl();
    const title = "First project";
    const description = "description";
    const testing = true;
    const uid = await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);
    await createUserModel(uid, email, username);

    const workspaceId = await createEmptyWorkspace(uid, workspaceUrl, title, description, testing);
    createdWorkspaces.push(workspaceId);
    await expect(
      createEmptyWorkspace(uid, workspaceUrl, title, description, testing)
    ).rejects.toBeString();

    const workspacesSnap = await adminDb
      .collection(COLLECTIONS.workspaces)
      .where("url", "==", workspaceUrl)
      .get();
    expect(workspacesSnap.size).toEqual(1);
  });

  it("Properly creates an empty workspace when many simultaneous requests are made.", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const workspaceUrl = getRandomUrl();
    const title = "First project";
    const description = "description";
    const testing = true;
    const uid = await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);
    await createUserModel(uid, email, username);

    const promises = [];
    const workspaceCreationAttempts = 10;
    let rejectedWorkspaceCreationAttempts = 0;
    let workspaceId = "";
    for (let i = 0; i < workspaceCreationAttempts; i++)
      promises.push(createEmptyWorkspace(uid, workspaceUrl, title, description, testing));
    const responses = await Promise.allSettled(promises);
    for (const res of responses) {
      if (res.status === "rejected") rejectedWorkspaceCreationAttempts++;
      else workspaceId = res.value;
    }
    if (workspaceId) createdWorkspaces.push(workspaceId);

    expect(rejectedWorkspaceCreationAttempts).toEqual(workspaceCreationAttempts - 1);
    const workspacesSnap = await adminDb
      .collection(COLLECTIONS.workspaces)
      .where("url", "==", workspaceUrl)
      .get();
    expect(workspacesSnap.size).toEqual(1);
    const userSnap = await adminDb.collection(COLLECTIONS.users).doc(uid).get();
    expect(userSnap.exists).toBeTrue();
    const user = userSnap.data() as User;
    expect(user.workspaces).toHaveLength(1);
    expect(user.workspaces[0].id).toEqual(workspaceId);
    expect(user.workspaces[0].title).toEqual(title);
    expect(user.workspaces[0].description).toEqual(description);
    const workspaceSnap = await adminDb.collection(COLLECTIONS.workspaces).doc(workspaceId).get();
    expect(workspaceSnap.exists).toBeTrue();
    const workspace = workspaceSnap.data() as Workspace;
    expect(workspace.id).toEqual(workspaceId);
    expect(workspace.url).toEqual(workspaceUrl);
    expect(workspace.title).toEqual(title);
    expect(workspace.description).toEqual(description);
    expect(workspace.testing).toEqual(testing);
    expect(workspace.counterId).toBeString();
    expect(workspace.userIds).toEqual([uid]);
    expect(workspace.invitedUserIds).toBeArrayOfSize(0);
    expect(workspace.columns).toEqual(INIT_TASK_COLUMNS);
    expect(workspace.labels).toEqual(INIT_TASK_LABELS);
    expect(workspace.hasItemsInBin).toBeFalse();
    expect(workspace.historyId).toBeEmpty();
    expect(workspace.placingInBinTime).toBeNull();
    expect(workspace.inRecycleBin).toBeFalse();
    expect(workspace.insertedIntoBinByUserId).toBeNull();
    const workspaceCounterSnap = await adminDb
      .collection(COLLECTIONS.counters)
      .doc(workspace.counterId)
      .get();
    expect(workspaceCounterSnap.exists).toBeTrue();
    const workspaceCounter = workspaceCounterSnap.data() as WorkspaceCounter;
    expect(workspaceCounter.workspaceId).toEqual(workspaceId);
    expect(workspaceCounter.nextTaskShortId).toEqual(INIT_COUNTER_TASK_SHORT_ID);
    expect(workspaceCounter.nextTaskSearchId).toEqual(INIT_COUNTER_TASK_SEARCH_ID);
    expect(workspaceCounter.nextLabelId).toEqual(INIT_COUNTER_LABEL_ID);
    expect(workspaceCounter.nextColumnId).toEqual(INIT_COUNTER_COLUMN_ID);
    expect(workspaceCounter.nextGoalShortId).toEqual(INIT_COUNTER_GOAL_SHORT_ID);
    expect(workspaceCounter.nextGoalSearchId).toEqual(INIT_COUNTER_GOAL_SEARCH_ID);
    expect(workspaceCounter.nextNormSearchId).toEqual(INIT_COUNTER_NORM_SEARCH_ID);
  });
});
