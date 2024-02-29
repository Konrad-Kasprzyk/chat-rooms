import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import compareNewestUsersHistoryRecord from "__tests__/utils/compareNewestHistoryRecord/compareNewestUsersHistoryRecord.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import switchUserIdBetweenLinkedBotIds from "client/api/user/switchUserIdBetweenLinkedBotIds.util";
import addBotToWorkspace from "client/api/workspace/addBotToWorkspace.api";
import inviteUserToWorkspace from "client/api/workspace/inviteUserToWorkspace.api";
import leaveWorkspace from "client/api/workspace/leaveWorkspace.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import UserDetails from "common/clientModels/userDetails.model";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test adding a bot to the open workspace.", () => {
  let testUserDetails: UserDetails;
  let workspaceId: string;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates the test user and workspace. Signs in the test user and opens the test workspace.
   */
  beforeEach(async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    testUserDetails = (await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    ))!;
    const filename = path.parse(__filename).name;
    workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
  });

  afterEach(async () => {
    await checkWorkspace(workspaceId);
  });

  it("The signed in user adds a bot to the open workspace.", async () => {
    const botId = testUserDetails!.linkedUserDocumentIds.find(
      (botId) => botId != testUserDetails.id
    )!;
    const oldModificationTime = new Date();

    await addBotToWorkspace(botId);

    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.includes(botId))
      )
    );
    expect(workspace!.userIds).toEqual([testUserDetails.id, botId].sort());
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await compareNewestUsersHistoryRecord(workspace!, {
      action: "users",
      userId: testUserDetails.id,
      date: workspace!.modificationTime,
      oldValue: null,
      value: botId,
    });
  });

  it("The signed in user adds an already invited bot to the open workspace.", async () => {
    const botId = testUserDetails!.linkedUserDocumentIds.find(
      (botId) => botId != testUserDetails.id
    )!;
    const botDocDTO = (await adminCollections.users.doc(botId).get()).data()!;
    await inviteUserToWorkspace(botDocDTO.email);
    const oldModificationTime = new Date();

    await addBotToWorkspace(botId);

    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.includes(botId))
      )
    );
    expect(workspace!.userIds).toEqual([testUserDetails.id, botId].sort());
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await compareNewestUsersHistoryRecord(workspace!, {
      action: "users",
      userId: testUserDetails.id,
      date: workspace!.modificationTime,
      oldValue: null,
      value: botId,
    });
  });

  it("The bot adds an another bot to the open workspace.", async () => {
    const firstBotId = testUserDetails!.linkedUserDocumentIds.find(
      (botId) => botId != testUserDetails.id
    )!;
    const secondBotId = testUserDetails!.linkedUserDocumentIds.find(
      (botId) => botId != firstBotId && botId != testUserDetails.id
    )!;
    await addBotToWorkspace(firstBotId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceId && workspace.userIds.includes(firstBotId)
        )
      )
    );
    await switchUserIdBetweenLinkedBotIds(firstBotId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == firstBotId)));
    const oldModificationTime = new Date();

    await addBotToWorkspace(secondBotId);

    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceId && workspace.userIds.includes(secondBotId)
        )
      )
    );
    expect(workspace!.userIds).toEqual([testUserDetails.id, firstBotId, secondBotId].sort());
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await compareNewestUsersHistoryRecord(workspace!, {
      action: "users",
      userId: firstBotId,
      date: workspace!.modificationTime,
      oldValue: null,
      value: secondBotId,
    });
  });

  it("The bot adds the signed in user to the open workspace.", async () => {
    const botId = testUserDetails!.linkedUserDocumentIds.find(
      (botId) => botId != testUserDetails.id
    )!;
    await addBotToWorkspace(botId);
    await leaveWorkspace(workspaceId);
    await switchUserIdBetweenLinkedBotIds(botId);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == botId)));
    await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.length == 1)
      )
    );
    const oldModificationTime = new Date();

    await addBotToWorkspace(testUserDetails.id);

    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.length == 2)
      )
    );
    expect(workspace!.userIds).toEqual([testUserDetails.id, botId].sort());
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    await compareNewestUsersHistoryRecord(workspace!, {
      action: "users",
      userId: botId,
      date: workspace!.modificationTime,
      oldValue: null,
      value: testUserDetails.id,
    });
  });
});
