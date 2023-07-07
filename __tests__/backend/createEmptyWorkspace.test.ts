import globalBeforeAll from "__tests__/globalBeforeAll";
import checkEmptyWorkspace from "__tests__/utils/checkDocs/checkEmptyWorkspace";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser";
import { createEmptyWorkspace } from "backend/workspace/createEmptyWorkspace";
import { getCurrentUser } from "client_api/user.api";
import COLLECTIONS from "common/constants/collections";
import Workspace from "common/models/workspace.model";
import { auth } from "db/firebase";
import { adminDb } from "db/firebase-admin";
import path from "path";
import { firstValueFrom, skipWhile } from "rxjs";
import { v4 as uuidv4 } from "uuid";

describe("Test the backend utils creating an empty workspace", () => {
  let uid: string;
  const workspaceTitle = "Test backend project";
  const filename = path.parse(__filename).name;
  const workspaceDescription = filename;

  beforeAll(async () => {
    await globalBeforeAll();
    uid = (await registerAndCreateTestUserDocuments(1))[0].id;
  });

  beforeEach(async () => {
    if (!auth.currentUser || auth.currentUser.uid !== uid) await signInTestUser(uid);
    await firstValueFrom(getCurrentUser().pipe(skipWhile((user) => !user || user.id !== uid)));
  });

  it("Throws an error when the user document is not found.", async () => {
    expect.assertions(2);
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);
    const workspaceUrl = uuidv4();

    await expect(
      createEmptyWorkspace(
        registeredOnlyUser.uid,
        workspaceUrl,
        workspaceTitle,
        workspaceDescription
      )
    ).toReject();

    const workspacesSnap = await adminDb
      .collection(COLLECTIONS.workspaces)
      .where("url" satisfies keyof Workspace, "==", workspaceUrl satisfies Workspace["url"])
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

    await checkEmptyWorkspace(workspace.id, workspaceUrl, workspaceTitle, workspaceDescription);
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
      .where("url" satisfies keyof Workspace, "==", workspaceUrl satisfies Workspace["url"])
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
    await checkEmptyWorkspace(workspaceId, workspaceUrl, workspaceTitle, workspaceDescription);
  });
});
