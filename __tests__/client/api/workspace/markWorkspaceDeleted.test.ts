import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkDeletedWorkspace from "__tests__/utils/checkDTODocs/deletedOrMarkedAsDeleted/checkDeletedWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import markWorkspaceDeleted from "client/api/workspace/markWorkspaceDeleted.api";
import moveWorkspaceToRecycleBin from "client/api/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test marking a workspace as deleted.", () => {
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
   * Creates and opens the test workspace.
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
  });

  it("Marks a workspace as deleted when only the workspace owner belongs to it.", async () => {
    await moveWorkspaceToRecycleBin();
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));
    let workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    const oldModificationTime = workspaceDTO.modificationTime.toDate();

    await markWorkspaceDeleted(workspaceId);

    workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    expect(workspaceDTO.isDeleted).toBeTrue();
    expect(workspaceDTO.deletionTime!.toDate()).toBeAfter(oldModificationTime);
    expect(workspaceDTO.deletionTime!.toDate()).toEqual(workspaceDTO.modificationTime.toDate());
    expect(workspaceDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceDTO.invitedUserEmails).toBeArrayOfSize(0);
    const workspaceSummaryDTO = (
      await adminCollections.workspaceSummaries.doc(workspaceId).get()
    ).data()!;
    expect(workspaceSummaryDTO.isDeleted).toBeTrue();
    expect(workspaceSummaryDTO.deletionTime!.toDate()).toEqual(workspaceDTO.deletionTime!.toDate());
    expect(workspaceSummaryDTO.deletionTime!.toDate()).toEqual(
      workspaceSummaryDTO.modificationTime.toDate()
    );
    expect(workspaceSummaryDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceSummaryDTO.invitedUserIds).toBeArrayOfSize(0);
    await checkDeletedWorkspace(workspaceId);
  });

  it("Marks a workspace as deleted when another user also belongs to it.", async () => {
    const otherUser = (await registerAndCreateTestUserDocuments(1))[0];
    await addUsersToWorkspace(workspaceId, [otherUser.uid]);
    await moveWorkspaceToRecycleBin();
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));
    let workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    expect(workspaceDTO.userIds).toBeArrayOfSize(2);
    const oldModificationTime = workspaceDTO.modificationTime.toDate();

    await markWorkspaceDeleted(workspaceId);

    workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    expect(workspaceDTO.isDeleted).toBeTrue();
    expect(workspaceDTO.deletionTime!.toDate()).toBeAfter(oldModificationTime);
    expect(workspaceDTO.deletionTime!.toDate()).toEqual(workspaceDTO.modificationTime.toDate());
    expect(workspaceDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceDTO.invitedUserEmails).toBeArrayOfSize(0);
    const workspaceSummaryDTO = (
      await adminCollections.workspaceSummaries.doc(workspaceId).get()
    ).data()!;
    expect(workspaceSummaryDTO.isDeleted).toBeTrue();
    expect(workspaceSummaryDTO.deletionTime!.toDate()).toEqual(workspaceDTO.deletionTime!.toDate());
    expect(workspaceSummaryDTO.deletionTime!.toDate()).toEqual(
      workspaceSummaryDTO.modificationTime.toDate()
    );
    expect(workspaceSummaryDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceSummaryDTO.invitedUserIds).toBeArrayOfSize(0);
    await checkDeletedWorkspace(workspaceId);
  });

  it("Marks a workspace as deleted when the workspace owner bots belong to it.", async () => {
    const workspaceOwnerDetails = await firstValueFrom(listenCurrentUserDetails());
    const botIds = workspaceOwnerDetails!.linkedUserDocumentIds.filter(
      (uid) => uid != workspacesOwner.uid
    );
    await addUsersToWorkspace(workspaceId, botIds);
    await moveWorkspaceToRecycleBin();
    await firstValueFrom(listenOpenWorkspace().pipe(filter((workspace) => workspace == null)));
    let workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    expect(workspaceDTO.userIds).toBeArrayOfSize(botIds.length + 1);
    const oldModificationTime = workspaceDTO.modificationTime.toDate();

    await markWorkspaceDeleted(workspaceId);

    workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    expect(workspaceDTO.isDeleted).toBeTrue();
    expect(workspaceDTO.deletionTime!.toDate()).toBeAfter(oldModificationTime);
    expect(workspaceDTO.deletionTime!.toDate()).toEqual(workspaceDTO.modificationTime.toDate());
    expect(workspaceDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceDTO.invitedUserEmails).toBeArrayOfSize(0);
    const workspaceSummaryDTO = (
      await adminCollections.workspaceSummaries.doc(workspaceId).get()
    ).data()!;
    expect(workspaceSummaryDTO.isDeleted).toBeTrue();
    expect(workspaceSummaryDTO.deletionTime!.toDate()).toEqual(workspaceDTO.deletionTime!.toDate());
    expect(workspaceSummaryDTO.deletionTime!.toDate()).toEqual(
      workspaceSummaryDTO.modificationTime.toDate()
    );
    expect(workspaceSummaryDTO.userIds).toBeArrayOfSize(0);
    expect(workspaceSummaryDTO.invitedUserIds).toBeArrayOfSize(0);
    await checkDeletedWorkspace(workspaceId);
  });
});
