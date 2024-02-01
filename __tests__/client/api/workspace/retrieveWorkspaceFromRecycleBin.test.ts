import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedWorkspace from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "clientApi/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import retrieveWorkspaceFromRecycleBin from "clientApi/workspace/retrieveWorkspaceFromRecycleBin.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test retrieving a workspace from the recycle bin.", () => {
  let workspacesOwner: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;
  let workspaceId: string;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates and opens the test workspace. Moves the workspace to the recycle bin.
   */
  beforeEach(async () => {
    workspacesOwner = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspacesOwner.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspacesOwner.uid)
      )
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == workspacesOwner.uid && user.workspaceIds.length == 1)
      )
    );
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    await moveWorkspaceToRecycleBin();
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));
  });

  it("Retrieves a workspace from the recycle bin.", async () => {
    const oldModificationTime = new Date();

    await retrieveWorkspaceFromRecycleBin(workspaceId);

    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    expect(workspace!.placingInBinTime).toBeNull();
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await checkNewlyCreatedWorkspace(
      workspace!.id,
      workspace!.url,
      workspace!.title,
      workspace!.description
    );
  });
});
