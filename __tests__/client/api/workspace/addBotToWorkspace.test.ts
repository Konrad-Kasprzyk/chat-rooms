import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import switchUserIdBetweenLinkedBotIds from "clientApi/user/switchUserIdBetweenLinkedBotIds.util";
import addBotToWorkspace from "clientApi/workspace/addBotToWorkspace.api";
import inviteUserToWorkspace from "clientApi/workspace/inviteUserToWorkspace.api";
import leaveWorkspace from "clientApi/workspace/leaveWorkspace.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import User from "common/clientModels/user.model";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test adding a bot to the open workspace.", () => {
  let testUser: User;
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
    testUser = (await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == testUserId && !user.dataFromFirebaseAccount)
      )
    ))!;
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    );
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
    const botId = testUser!.linkedUserDocumentIds.find((botId) => botId != testUser.id)!;
    const oldModificationTime = new Date();

    await addBotToWorkspace(botId);

    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.includes(botId))
      )
    );
    expect(workspace!.userIds).toEqual([testUser.id, botId].sort());
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("The signed in user adds an already invited bot to the open workspace.", async () => {
    const botId = testUser!.linkedUserDocumentIds.find((botId) => botId != testUser.id)!;
    const botDocDTO = (await adminCollections.users.doc(botId).get()).data()!;
    await inviteUserToWorkspace(botDocDTO.email);
    const oldModificationTime = new Date();

    await addBotToWorkspace(botId);

    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.includes(botId))
      )
    );
    expect(workspace!.userIds).toEqual([testUser.id, botId].sort());
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("The bot adds an another bot to the open workspace.", async () => {
    const firstBotId = testUser!.linkedUserDocumentIds.find((botId) => botId != testUser.id)!;
    const secondBotId = testUser!.linkedUserDocumentIds.find(
      (botId) => botId != firstBotId && botId != testUser.id
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
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == firstBotId && !user.dataFromFirebaseAccount)
      )
    );
    const oldModificationTime = new Date();

    await addBotToWorkspace(secondBotId);

    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) => workspace?.id == workspaceId && workspace.userIds.includes(secondBotId)
        )
      )
    );
    expect(workspace!.userIds).toEqual([testUser.id, firstBotId, secondBotId].sort());
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });

  it("The bot adds the signed in user to the open workspace.", async () => {
    const botId = testUser!.linkedUserDocumentIds.find((botId) => botId != testUser.id)!;
    await addBotToWorkspace(botId);
    await leaveWorkspace(workspaceId);
    await switchUserIdBetweenLinkedBotIds(botId);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == botId && !user.dataFromFirebaseAccount))
    );
    await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.length == 1)
      )
    );
    const oldModificationTime = new Date();

    await addBotToWorkspace(testUser.id);

    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.userIds.length == 2)
      )
    );
    expect(workspace!.userIds).toEqual([testUser.id, botId].sort());
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
  });
});
