import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import validateUsersHistory from "__tests__/utils/modelValidators/clientModelValidators/historyModels/validateUsersHistory.util";
import validateWorkspaceHistory from "__tests__/utils/modelValidators/clientModelValidators/historyModels/validateWorkspaceHistory.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import acceptWorkspaceInvitation from "client/api/user/acceptWorkspaceInvitation.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import cancelUserInvitationToWorkspace from "client/api/workspace/cancelUserInvitationToWorkspace.api";
import changeWorkspaceDescription from "client/api/workspace/changeWorkspaceDescription.api";
import changeWorkspaceTitle from "client/api/workspace/changeWorkspaceTitle.api";
import inviteUserToWorkspace from "client/api/workspace/inviteUserToWorkspace.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import moveWorkspaceToRecycleBin from "client/api/workspace/moveWorkspaceToRecycleBin.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import removeUserFromWorkspace from "client/api/workspace/removeUserFromWorkspace.api";
import mapUsersHistoryDTO from "client/utils/mappers/historyMappers/mapUsersHistoryDTO.util";
import mapWorkspaceHistoryDTO from "client/utils/mappers/historyMappers/mapWorkspaceHistoryDTO.util";
import Workspace from "common/clientModels/workspace.model";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test DTO history mappers", () => {
  let workspaceCreatorId: string;
  let workspaceId: string;
  let workspace: Workspace;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates the test user and workspace. Signs in the test user and opens the test workspace.
   */
  beforeEach(async () => {
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == workspaceCreatorId))
    );
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    workspace = (await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    ))!;
  });

  //TODO
  it.skip("Test ArchivedGoals DTO mapper.", async () => {});

  //TODO
  it.skip("Test ArchivedTasks DTO mapper.", async () => {});

  //TODO
  it.skip("Test ColumnsHistory DTO mapper.", async () => {});

  //TODO
  it.skip("Test GoalHistory DTO mapper.", async () => {});

  //TODO
  it.skip("Test LabelsHistory DTO mapper.", async () => {});

  //TODO
  it.skip("Test TaskHistory DTO mapper.", async () => {});

  it("Test UsersHistory DTO mapper.", async () => {
    const dateBeforeMapping = new Date();
    const testUsers = await registerAndCreateTestUserDocuments(5);
    for (const testUser of testUsers) await inviteUserToWorkspace(testUser.email);
    await cancelUserInvitationToWorkspace(testUsers[0].email);
    await signInTestUser(testUsers[1].uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUsers[1].uid)));
    await acceptWorkspaceInvitation(workspaceId);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    await removeUserFromWorkspace(workspaceCreatorId);
    await moveWorkspaceToRecycleBin();
    const usersHistoryDTO = (
      await adminCollections.userHistories.doc(workspace.newestUsersHistoryId).get()
    ).data()!;

    const usersHistory = mapUsersHistoryDTO(usersHistoryDTO);

    const dateAfterMapping = new Date();
    /**
     * 9 operations: invite 5 users, cancel user invitation, accept user invitation (new user added),
     * remove user, move workspace to recycle bin (cancel all invitations)
     */
    expect(usersHistory.history).toBeArrayOfSize(9);
    expect(usersHistory.modificationTime).toEqual(usersHistoryDTO.modificationTime.toDate());
    expect(usersHistory.fetchingFromSeverTime).toBeAfterOrEqualTo(dateBeforeMapping);
    expect(usersHistory.fetchingFromSeverTime).toBeBeforeOrEqualTo(dateAfterMapping);
    expect(usersHistory.hasOfflineChanges).toBeFalse();
    validateUsersHistory(usersHistory);
  });

  it("Test WorkspaceHistory DTO mapper.", async () => {
    const dateBeforeMapping = new Date();
    const newTitle = "changed " + workspace.title;
    const newDescription = "changed " + workspace.description;
    await changeWorkspaceTitle(newTitle);
    await changeWorkspaceDescription(newDescription);
    await moveWorkspaceToRecycleBin();
    const workspaceHistoryDTO = (
      await adminCollections.workspaceHistories.doc(workspace.newestWorkspaceHistoryId).get()
    ).data()!;

    const workspaceHistory = mapWorkspaceHistoryDTO(workspaceHistoryDTO);

    const dateAfterMapping = new Date();
    /**
     * 4 operations: workspace creation, change title, change description, move workspace to recycle bin
     */
    expect(workspaceHistory.history).toBeArrayOfSize(4);
    expect(workspaceHistory.modificationTime).toEqual(
      workspaceHistoryDTO.modificationTime.toDate()
    );
    expect(workspaceHistory.fetchingFromSeverTime).toBeAfterOrEqualTo(dateBeforeMapping);
    expect(workspaceHistory.fetchingFromSeverTime).toBeBeforeOrEqualTo(dateAfterMapping);
    expect(workspaceHistory.hasOfflineChanges).toBeFalse();
    validateWorkspaceHistory(workspaceHistory);
  });
});
