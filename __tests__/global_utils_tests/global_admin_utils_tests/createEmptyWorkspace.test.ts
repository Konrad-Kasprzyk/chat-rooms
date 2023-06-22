import globalBeforeAll from "__tests__/globalBeforeAll";
import checkEmptyWorkspace from "__tests__/utils/checkEmptyWorkspace";
import { getCurrentUser } from "client_api/user.api";
import { adminDb } from "db/firebase-admin";
import COLLECTIONS from "global/constants/collections";
import { createEmptyWorkspace } from "global/utils/admin_utils/workspace";
import {
  registerAndCreateTestUserDocuments,
  registerTestUsers,
  signInTestUser,
} from "global/utils/test_utils/testUsersMockedAuth";
import path from "path";
import { firstValueFrom, skipWhile } from "rxjs";
import { v4 as uuidv4 } from "uuid";

describe("Test admin utils creating an empty workspace", () => {
  let uid: string;
  const workspaceTitle = "First project";
  const filename = path.parse(__filename).name;
  const workspaceDescription = filename;

  beforeAll(async () => {
    await globalBeforeAll();
    uid = (await registerAndCreateTestUserDocuments(1))[0].id;
  });

  beforeEach(async () => {
    await signInTestUser(uid);
    await firstValueFrom(getCurrentUser().pipe(skipWhile((user) => !user || user.id !== uid)));
  });

  it("Throws an error when user document is not found.", async () => {
    const user = registerTestUsers(1)[0];
    await signInTestUser(user.uid);
    await firstValueFrom(getCurrentUser().pipe(skipWhile((user) => user !== null)));
    const workspaceUrl = uuidv4();

    await expect(
      createEmptyWorkspace(user.uid, workspaceUrl, workspaceTitle, workspaceDescription)
    ).toReject();

    const workspacesSnap = await adminDb
      .collection(COLLECTIONS.workspaces)
      .where("url", "==", workspaceUrl)
      .get();
    expect(workspacesSnap.size).toEqual(0);
  });

  it("Properly creates an empty workspace.", async () => {
    const workspaceUrl = uuidv4();

    const workspace = await createEmptyWorkspace(
      uid,
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
    );

    await checkEmptyWorkspace(
      uid,
      workspace.id,
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
    );
  });

  it("Throws error when the workspace url is already taken.", async () => {
    const workspaceUrl = uuidv4();

    const workspace = await createEmptyWorkspace(
      uid,
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
    );
    await expect(
      createEmptyWorkspace(uid, workspaceUrl, workspaceTitle, workspaceDescription)
    ).toReject();

    expect(workspace.id).toBeString();
    const workspacesSnap = await adminDb
      .collection(COLLECTIONS.workspaces)
      .where("url", "==", workspaceUrl)
      .get();
    expect(workspacesSnap.size).toEqual(1);
  });

  it("Properly creates an empty workspace when many simultaneous requests are made.", async () => {
    const workspaceUrl = uuidv4();
    const promises = [];
    const workspaceCreationAttempts = 10;
    let rejectedWorkspaceCreationAttempts = 0;
    let workspaceId = "";

    for (let i = 0; i < workspaceCreationAttempts; i++)
      promises.push(createEmptyWorkspace(uid, workspaceUrl, workspaceTitle, workspaceDescription));
    const responses = await Promise.allSettled(promises);
    for (const res of responses) {
      if (res.status === "rejected") rejectedWorkspaceCreationAttempts++;
      else workspaceId = res.value.id;
    }

    expect(rejectedWorkspaceCreationAttempts).toEqual(workspaceCreationAttempts - 1);
    await checkEmptyWorkspace(uid, workspaceId, workspaceUrl, workspaceTitle, workspaceDescription);
  });
});
