import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import leaveWorkspace from "clientApi/workspace/leaveWorkspace.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "clientApi/workspace/moveWorkspaceToRecycleBin.api";
import { getOpenWorkspaceId, setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test leaving the open workspace.", () => {
  let workspaceCreatorId: string;
  let workspaceId: string;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates the test workspace and user. Sets the open workspace to null.
   */
  beforeEach(async () => {
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == workspaceCreatorId && user.workspaceIds.length == 1)
      )
    );
    setOpenWorkspaceId(null);
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));
  });

  it("Leaves the open workspace", async () => {
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = new Date();

    await leaveWorkspace(workspaceId);
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));

    expect(getOpenWorkspaceId()).toBeNull();
    const userDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == workspaceCreatorId && user.workspaceIds.length == 0)
      )
    );
    expect(userDoc!.workspaceIds).toBeArrayOfSize(0);
    const userDetailsDTO = (
      await adminCollections.userDetails.doc(workspaceCreatorId).get()
    ).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toBeArrayOfSize(0);
    const workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    expect(workspaceDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceDTO.modificationTime.toDate()).toBeAfter(oldModificationTime);
    const workspaceSummaryDTO = (
      await adminCollections.workspaceSummaries.doc(workspaceId).get()
    ).data()!;
    expect(workspaceSummaryDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceSummaryDTO.modificationTime.toDate()).toBeAfter(oldModificationTime);
    await checkWorkspace(workspaceDTO.id);
  });

  it("Leaves a workspace which is not open", async () => {
    setOpenWorkspaceId(null);
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));
    const oldModificationTime = new Date();

    await leaveWorkspace(workspaceId);

    expect(getOpenWorkspaceId()).toBeNull();
    const userDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == workspaceCreatorId && user.workspaceIds.length == 0)
      )
    );
    expect(userDoc!.workspaceIds).toBeArrayOfSize(0);
    const userDetailsDTO = (
      await adminCollections.userDetails.doc(workspaceCreatorId).get()
    ).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toBeArrayOfSize(0);
    const workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    expect(workspaceDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceDTO.modificationTime.toDate()).toBeAfter(oldModificationTime);
    const workspaceSummaryDTO = (
      await adminCollections.workspaceSummaries.doc(workspaceId).get()
    ).data()!;
    expect(workspaceSummaryDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceSummaryDTO.modificationTime.toDate()).toBeAfter(oldModificationTime);
    await checkWorkspace(workspaceDTO.id);
  });

  it("Leaves a workspace which is put in the recycle bin", async () => {
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    await moveWorkspaceToRecycleBin();
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));
    const oldModificationTime = new Date();

    await leaveWorkspace(workspaceId);

    expect(getOpenWorkspaceId()).toBeNull();
    const userDoc = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == workspaceCreatorId && user.workspaceIds.length == 0)
      )
    );
    expect(userDoc!.workspaceIds).toBeArrayOfSize(0);
    const userDetailsDTO = (
      await adminCollections.userDetails.doc(workspaceCreatorId).get()
    ).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toBeArrayOfSize(0);
    const workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    expect(workspaceDTO.isInBin).toBeTrue;
    expect(workspaceDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceDTO.modificationTime.toDate()).toBeAfter(oldModificationTime);
    const workspaceSummaryDTO = (
      await adminCollections.workspaceSummaries.doc(workspaceId).get()
    ).data()!;
    expect(workspaceSummaryDTO.isInBin).toBeTrue;
    expect(workspaceSummaryDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceSummaryDTO.modificationTime.toDate()).toBeAfter(oldModificationTime);
    await checkWorkspace(workspaceDTO.id);
  });
});
