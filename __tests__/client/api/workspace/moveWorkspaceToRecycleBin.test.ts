import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import compareNewestUsersHistoryRecord from "__tests__/utils/compareNewestHistoryRecord/compareNewestUsersHistoryRecord.util";
import compareNewestWorkspaceHistoryRecord from "__tests__/utils/compareNewestHistoryRecord/compareNewestWorkspaceHistoryRecord.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "client/api/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test moving a workspace to the recycle bin.", () => {
  let workspaceOwnerId: string;
  let workspaceId: string;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates the workspace to be moved to the recycle bin.
   */
  beforeEach(async () => {
    workspaceOwnerId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceOwnerId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == workspaceOwnerId))
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
  });

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
    await compareNewestWorkspaceHistoryRecord(workspaceDTO, {
      action: "placingInBinTime",
      userId: workspaceOwnerId,
      date: workspaceDTO.modificationTime.toDate(),
      oldValue: null,
      value: workspaceDTO.placingInBinTime!.toDate(),
    });
    await compareNewestUsersHistoryRecord(workspaceDTO, {
      action: "allInvitationsCancel",
      userId: workspaceOwnerId,
      date: workspaceDTO.modificationTime.toDate(),
      oldValue: [],
      value: null,
    });
  });

  it("Cancels all user invitations when a workspace is moved to the recycle bin.", async () => {
    setOpenWorkspaceId(workspaceId);
    const invitedUserEmails = (await registerAndCreateTestUserDocuments(3)).map(
      (user) => user.email
    );
    await addUsersToWorkspace(workspaceId, [], invitedUserEmails);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceId && workspace.invitedUserEmails.length == 3
        )
      )
    );
    const oldModificationTime = workspace!.modificationTime;

    await moveWorkspaceToRecycleBin();
    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace == null))
    );

    const workspaceDTOSnap = await adminCollections.workspaces.doc(workspaceId).get();
    const workspaceDTO = workspaceDTOSnap.data()!;
    expect(workspaceDTO.id).toEqual(workspaceId);
    expect(workspaceDTO.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspaceDTO.isInBin).toBeTrue();
    expect(workspaceDTO.placingInBinTime).toEqual(workspaceDTO.modificationTime);
    expect(workspaceDTO.modificationTime.toDate()).toBeAfter(oldModificationTime);
    const invitedUsersSnap = await adminCollections.users
      .where("workspaceInvitationIds", "array-contains", workspaceId)
      .get();
    expect(invitedUsersSnap.size).toEqual(0);
    await checkWorkspace(workspaceId);
    await compareNewestWorkspaceHistoryRecord(workspaceDTO, {
      action: "placingInBinTime",
      userId: workspaceOwnerId,
      date: workspaceDTO.modificationTime.toDate(),
      oldValue: null,
      value: workspaceDTO.placingInBinTime!.toDate(),
    });
    await compareNewestUsersHistoryRecord(workspaceDTO, {
      action: "allInvitationsCancel",
      userId: workspaceOwnerId,
      date: workspaceDTO.modificationTime.toDate(),
      oldValue: invitedUserEmails,
      value: null,
    });
  });
});
