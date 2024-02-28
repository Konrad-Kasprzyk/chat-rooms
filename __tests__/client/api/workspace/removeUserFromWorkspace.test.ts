import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import compareNewestUsersHistoryRecord from "__tests__/utils/compareNewestHistoryRecord/compareNewestUsersHistoryRecord.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import removeUserFromWorkspace from "client/api/workspace/removeUserFromWorkspace.api";
import listenWorkspaceSummaries from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test removing a user from a workspace.", () => {
  let workspaceCreatorId: string;
  let workspaceId: string;
  let testUserId: string;
  let oldModificationTime: Date;
  const filename = path.parse(__filename).name;

  /**
   * Creates the test workspace and test users.
   */
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates the new test workspace and new test users. Signs in the workspace creator, opens the
   * workspace and adds the test user to the workspace.
   */
  beforeEach(async () => {
    const testUsers = await registerAndCreateTestUserDocuments(2);
    workspaceCreatorId = testUsers[0].uid;
    testUserId = testUsers[1].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    workspaceId = await createTestWorkspace(filename);
    await addUsersToWorkspace(workspaceId, [testUserId]);
    setOpenWorkspaceId(workspaceId);
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.length == 2)
      )
    );
    oldModificationTime = workspace!.modificationTime;
  });

  afterEach(async () => {
    await checkWorkspace(workspaceId);
  });

  it("Removes an other user from the workspace.", async () => {
    await removeUserFromWorkspace(testUserId);
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.length == 1)
      )
    );
    const workspaceSummary = (
      await firstValueFrom(
        listenWorkspaceSummaries().pipe(
          filter(
            (ws) =>
              ws.docs.length == 1 && ws.docs[0].id == workspaceId && ws.docs[0].userIds.length == 1
          )
        )
      )
    ).docs[0];

    expect(workspace!.userIds).toEqual([workspaceCreatorId]);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    expect(workspaceSummary!.userIds).toEqual([workspaceCreatorId]);
    expect(workspaceSummary!.modificationTime).toBeAfter(oldModificationTime);
    const removedUserDTO = (await adminCollections.users.doc(testUserId).get()).data()!;
    expect(removedUserDTO.workspaceIds).toBeArrayOfSize(0);
    const removedUserDetailsDTO = (
      await adminCollections.userDetails.doc(testUserId).get()
    ).data()!;
    expect(removedUserDetailsDTO.allLinkedUserBelongingWorkspaceIds).toBeArrayOfSize(0);
    await compareNewestUsersHistoryRecord(workspace!, {
      action: "userRemovedFromWorkspace",
      userId: workspaceCreatorId,
      date: workspace!.modificationTime,
      oldValue: {
        id: removedUserDTO.id,
        email: removedUserDTO.email,
        username: removedUserDTO.username,
        isBotUserDocument: removedUserDTO.isBotUserDocument,
      },
      value: null,
    });
  });

  it("Removes the signed in user from the workspace.", async () => {
    await removeUserFromWorkspace(workspaceCreatorId);

    const workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;
    expect(workspaceDTO.userIds).toEqual([testUserId]);
    expect(workspaceDTO.modificationTime.toDate()).toBeAfter(oldModificationTime);
    const workspaceSummaryDTO = (
      await adminCollections.workspaceSummaries.doc(workspaceId).get()
    ).data()!;
    expect(workspaceSummaryDTO.userIds).toEqual([testUserId]);
    expect(workspaceSummaryDTO.modificationTime.toDate()).toBeAfter(oldModificationTime);
    const removedUser = await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == workspaceCreatorId && user.workspaceIds.length == 0)
      )
    );
    expect(removedUser!.workspaceIds).toBeArrayOfSize(0);
    const removedUserDetailsDTO = (
      await adminCollections.userDetails.doc(workspaceCreatorId).get()
    ).data()!;
    expect(removedUserDetailsDTO.allLinkedUserBelongingWorkspaceIds).toBeArrayOfSize(0);
    await compareNewestUsersHistoryRecord(workspaceDTO!, {
      action: "userRemovedFromWorkspace",
      userId: workspaceCreatorId,
      date: workspaceDTO!.modificationTime.toDate(),
      oldValue: {
        id: removedUser!.id,
        email: removedUser!.email,
        username: removedUser!.username,
        isBotUserDocument: removedUser!.isBotUserDocument,
      },
      value: null,
    });
  });
});
