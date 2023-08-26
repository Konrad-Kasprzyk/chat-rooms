import globalBeforeAll from "__tests__/globalBeforeAll";
import checkEmptyWorkspace from "__tests__/utils/checkDocs/checkEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import createEmptyWorkspace from "client_api/workspace/createEmptyWorkspace.api";
import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import { getDocs } from "firebase/firestore";
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
    await firstValueFrom(listenCurrentUser().pipe(skipWhile((user) => !user || user.id !== uid)));
  });

  it("Throws an error when user document is not found.", async () => {
    expect.assertions(2);
    const user = registerTestUsers(1)[0];
    await signInTestUser(user.uid);
    const workspaceUrl = uuidv4();

    await expect(
      createEmptyWorkspace(workspaceUrl, workspaceTitle, workspaceDescription)
    ).toReject();

    const workspacesQuery = collections.workspaces.where("url", "==", workspaceUrl);
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

    await checkEmptyWorkspace(
      workspaceId,
      workspaceUrl,
      workspaceTitle,
      workspaceDescription,
      true
    );
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
    const workspacesQuery = collections.workspaces.where("url", "==", workspaceUrl);
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
    await checkEmptyWorkspace(
      workspaceId,
      workspaceUrl,
      workspaceTitle,
      workspaceDescription,
      true
    );
  });
});
