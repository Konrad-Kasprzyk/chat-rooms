import COLLECTIONS from "../../global/constants/collections";
import User from "../../global/models/user.model";
import {
  requireBodyInRequest,
  requireContentTypeInRequest,
  requirePostMethod,
} from "../utils/testApiPostRequests";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../global/admin_utils/emailPasswordUser";
import fetchPost from "../../global/utils/fetchPost";
import createUserModel from "../../global/admin_utils/createUserModel";
import {
  deleteWorkspaceAndRelatedDocuments,
  getRandomUrl,
} from "../../global/admin_utils/workspace";
import { adminDb } from "../../db/firebase-admin";
import Workspace from "../../global/models/workspace.model";
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
} from "../../global/constants/workspaceInitValues";
import WorkspaceCounter from "../../global/models/workspaceCounter.model";

const usedEmails: string[] = [];
const createdWorkspaces: string[] = [];
const apiUrl = "api/create-empty-workspace";

function getEmail() {
  const email = getUniqueEmail();
  usedEmails.push(email);
  return email;
}

describe("Test api creating an empty workspace", () => {
  afterAll(async () => {
    const promises: Promise<any>[] = [];
    promises.push(deleteRegisteredUsersAndUserDocuments(usedEmails));
    for (const workspaceId of createdWorkspaces)
      promises.push(deleteWorkspaceAndRelatedDocuments(workspaceId));
    await Promise.all(promises);
  });

  it("Requires proper POST method", async () => {
    await requirePostMethod(apiUrl);
    await requireContentTypeInRequest(apiUrl);
    await requireBodyInRequest(apiUrl);
  });

  it("Requires appropriate properties in body request to create an empty workspace", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const workspaceUrl = getRandomUrl();
    const title = "First project";
    const description = "description";
    const uid = await registerUserEmailPassword(email, password, username);
    const idToken = await signInEmailPasswordAndGetIdToken(email, password);
    await createUserModel(uid, email, username);

    const res = await fetchPost(apiUrl, { idToken, url42: workspaceUrl, title, description });

    expect(res.status).toEqual(400);
  });

  it("Properly creates an empty workspace", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const workspaceUrl = getRandomUrl();
    const title = "First project";
    const description = "description";
    const uid = await registerUserEmailPassword(email, password, username);
    const idToken = await signInEmailPasswordAndGetIdToken(email, password);
    await createUserModel(uid, email, username);

    const res = await fetchPost(apiUrl, { idToken, url: workspaceUrl, title, description });

    expect(res.status).toEqual(201);
    const workspaceId = await res.text();
    expect(workspaceId).toBeString();
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
    expect(workspace.testing).toBeFalse();
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

  it("Doesn't create an empty workspace, when workspace url is already taken.", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const workspaceUrl = getRandomUrl();
    const title = "First project";
    const description = "description";
    const uid = await registerUserEmailPassword(email, password, username);
    const idToken = await signInEmailPasswordAndGetIdToken(email, password);
    await createUserModel(uid, email, username);

    let res = await fetchPost(apiUrl, { idToken, url: workspaceUrl, title, description });
    expect(res.status).toEqual(201);
    const workspaceId = await res.text();
    expect(workspaceId).toBeString();
    createdWorkspaces.push(workspaceId);
    res = await fetchPost(apiUrl, { idToken, url: workspaceUrl, title, description });

    expect(res.status).toEqual(400);
    const error = await res.text();
    expect(error).toBeString();
    const workspacesSnap = await adminDb
      .collection(COLLECTIONS.workspaces)
      .where("url", "==", workspaceUrl)
      .get();
    expect(workspacesSnap.size).toEqual(1);
  });
});
