import globalBeforeAll from "__tests__/globalBeforeAll";
import checkEmptyWorkspace from "__tests__/utils/checkDocs/checkEmptyWorkspace";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser";
import { getCurrentUser } from "client_api/user.api";
import { createEmptyWorkspace } from "client_api/workspace.api";
import COLLECTIONS from "common/constants/collections";
import Workspace from "common/models/workspace.model";
import { auth, db } from "db/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import path from "path";
import { firstValueFrom, skipWhile } from "rxjs";
import { v4 as uuidv4 } from "uuid";

describe("Test client api creating an empty workspace", () => {
  let uid: string;
  const workspaceTitle = "First project";
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

  it("Throws an error when user document is not found.", async () => {
    expect.assertions(2);
    const user = registerTestUsers(1)[0];
    await signInTestUser(user.uid);
    const workspaceUrl = uuidv4();

    await expect(
      createEmptyWorkspace(workspaceUrl, workspaceTitle, workspaceDescription)
    ).toReject();

    const workspacesQuery = query(
      collection(db, COLLECTIONS.workspaces),
      where("url" satisfies keyof Workspace, "==", workspaceUrl satisfies Workspace["url"])
    );
    const workspacesSnap = await getDocs(workspacesQuery);
    expect(workspacesSnap.size).toEqual(0);
  });

  it("Properly creates an empty workspace.", async () => {
    const workspaceUrl = uuidv4();

    const workspaceId = await createEmptyWorkspace(
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
    );

    await checkEmptyWorkspace(workspaceId, workspaceUrl, workspaceTitle, workspaceDescription);
  });

  it("Throws error when the workspace url is already taken.", async () => {
    const workspaceUrl = uuidv4();

    const workspaceId = await createEmptyWorkspace(
      workspaceUrl,
      workspaceTitle,
      workspaceDescription
    );
    await expect(
      createEmptyWorkspace(workspaceUrl, workspaceTitle, workspaceDescription)
    ).toReject();

    expect(workspaceId).toBeString();
    const workspacesQuery = query(
      collection(db, COLLECTIONS.workspaces),
      where("url" satisfies keyof Workspace, "==", workspaceUrl satisfies Workspace["url"])
    );
    const workspacesSnap = await getDocs(workspacesQuery);
    expect(workspacesSnap.size).toEqual(1);
  });

  it("Properly creates an empty workspace when many simultaneous requests are made.", async () => {
    const workspaceUrl = uuidv4();
    const promises = [];
    const workspaceCreationAttempts = 10;
    let rejectedWorkspaceCreationAttempts = 0;
    let workspaceId = "";

    for (let i = 0; i < workspaceCreationAttempts; i++)
      promises.push(createEmptyWorkspace(workspaceUrl, workspaceTitle, workspaceDescription));
    const responses = await Promise.allSettled(promises);
    for (const res of responses) {
      if (res.status === "rejected") rejectedWorkspaceCreationAttempts++;
      else workspaceId = res.value;
    }

    expect(rejectedWorkspaceCreationAttempts).toEqual(workspaceCreationAttempts - 1);
    await checkEmptyWorkspace(workspaceId, workspaceUrl, workspaceTitle, workspaceDescription);
  });
});
