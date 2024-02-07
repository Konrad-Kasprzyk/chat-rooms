import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "client/api/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
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
    workspaceId = await createTestWorkspace(filename);
  }, BEFORE_ALL_TIMEOUT);

  it("Moves the open workspace to the recycle bin.", async () => {
    setOpenWorkspaceId(workspaceId);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime;

    await moveWorkspaceToRecycleBin();
    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace == null))
    );

    const workspaceDTOSnap = await adminCollections.workspaces.doc(workspaceId).get();
    const workspaceDTO = workspaceDTOSnap.data()!;
    expect(workspaceDTO.id).toEqual(workspaceId);
    expect(workspaceDTO.isInBin).toBeTrue();
    expect(workspaceDTO.placingInBinTime).toEqual(workspaceDTO.modificationTime);
    expect(workspaceDTO.modificationTime.toDate()).toBeAfter(oldModificationTime);
    await checkWorkspace(workspaceId);
  });
});
