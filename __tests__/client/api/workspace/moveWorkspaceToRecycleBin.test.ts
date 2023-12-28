import BEFORE_ALL_TIMEOUT from "__tests__/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import listenOpenWorkspace from "client_api/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "client_api/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test moving the workspace to the recycle bin.", () => {
  let workspaceOwnerId: string;
  let workspaceId: string;

  /**
   * Creates the workspace to be moved to the recycle bin.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceOwnerId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceOwnerId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == workspaceOwnerId)));
    const filename = path.parse(__filename).name;
    workspaceId = await createTestEmptyWorkspace(filename);
  }, BEFORE_ALL_TIMEOUT);

  it("Moves the open workspace to the recycle bin.", async () => {
    setOpenWorkspaceId(workspaceId);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime.toMillis();

    await moveWorkspaceToRecycleBin();
    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.isInBin == true)
      )
    );

    expect(workspace?.id).toEqual(workspaceId);
    expect(workspace?.isInBin).toBeTrue();
    expect(workspace?.placingInBinTime!.toMillis()).toEqual(workspace?.modificationTime.toMillis());
    expect(workspace?.insertedIntoBinByUserId).toEqual(workspaceOwnerId);
    expect(workspace?.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
  });
});
