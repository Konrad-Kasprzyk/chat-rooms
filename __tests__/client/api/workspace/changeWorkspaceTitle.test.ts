import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedWorkspace from "__tests__/utils/checkDocs/newlyCreated/checkNewlyCreatedWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import changeWorkspaceTitle from "clientApi/workspace/changeWorkspaceTitle.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test changing the workspace title.", () => {
  let workspacesOwner: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;
  let workspaceId: string;

  /**
   * Creates and opens the workspace to test changing the title.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspacesOwner = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspacesOwner.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspacesOwner.uid)
      )
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
  }, BEFORE_ALL_TIMEOUT);

  it("Properly changes the workspace title", async () => {
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime.toMillis();
    const newTitle = "changed " + workspace!.title;

    changeWorkspaceTitle(newTitle);

    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.title == newTitle)
      )
    );
    expect(workspace!.title).toEqual(newTitle);
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    await checkNewlyCreatedWorkspace(
      workspaceId,
      workspace!.url,
      workspace!.title,
      workspace!.description
    );
  });
});
