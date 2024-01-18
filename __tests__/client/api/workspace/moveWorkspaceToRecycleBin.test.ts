import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestEmptyWorkspace from "__tests__/utils/workspace/createTestEmptyWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "clientApi/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
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
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == workspaceOwnerId))
    );
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
      listenOpenWorkspace().pipe(filter((workspace) => workspace == null))
    );

    const workspaceSnap = await adminCollections.workspaces.doc(workspaceId).get();
    workspace = workspaceSnap.data()!;
    expect(workspace!.id).toEqual(workspaceId);
    expect(workspace!.isInBin).toBeTrue();
    expect(workspace!.placingInBinTime!.toMillis()).toEqual(workspace!.modificationTime.toMillis());
    expect(workspace!.insertedIntoBinByUserId).toEqual(workspaceOwnerId);
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    await checkWorkspace(workspaceId);
  });
});
