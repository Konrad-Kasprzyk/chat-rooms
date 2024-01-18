import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkDocs/newlyCreated/checkNewlyCreatedUser.util";
import checkNewlyCreatedWorkspace from "__tests__/utils/checkDocs/newlyCreated/checkNewlyCreatedWorkspace.util";
import checkUser from "__tests__/utils/checkDocs/usableOrInBin/checkUser.util";
import checkWorkspace from "__tests__/utils/checkDocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import acceptWorkspaceInvitation from "clientApi/user/acceptWorkspaceInvitation.api";
import changeCurrentUserUsername from "clientApi/user/changeCurrentUserUsername.api";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import { getSignedInUserId } from "clientApi/user/signedInUserId.utils";
import switchUserIdBetweenLinkedBotIds from "clientApi/user/switchUserIdBetweenLinkedBotIds.util";
import changeWorkspaceTitle from "clientApi/workspace/changeWorkspaceTitle.api";
import inviteUserToWorkspace from "clientApi/workspace/inviteUserToWorkspace.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { getOpenWorkspaceId, setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import auth from "common/db/auth.firebase";
import User from "common/models/user.model";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test changing the signed in user id between linked bot ids.", () => {
  let testUser: User;
  let userBotIds: string[];
  const filename = path.parse(__filename).name;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Every test creates and signs in a new test user. Filters the main user id from linked user
   * document ids and stores those bot ids.
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
    userBotIds = testUser.linkedUserDocumentIds.filter((uid) => uid != testUser.id);
  });

  afterEach(async () => {
    await checkUser(testUser.id);
  });

  it("Switches the signed in user id to a linked bot id.", async () => {
    const botId = userBotIds[0];

    await switchUserIdBetweenLinkedBotIds(botId);
    const botUser = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == botId))
    );
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == botId))
    );

    expect(botUser!.id).toEqual(botId);
    expect(botUser!.dataFromFirebaseAccount).toBeFalse();
    expect(botUser!.isBotUserDocument).toBeTrue();
    expect(botUser!.linkedUserDocumentIds).toEqual(testUser.linkedUserDocumentIds);
    expect(getSignedInUserId()).toEqual(botId);
    expect(auth.currentUser!.uid).toEqual(testUser.id);
    await checkNewlyCreatedUser(botId, botUser!.email, botUser!.username);
  });

  it("Switches the signed in user id from one bot id to another bot id.", async () => {
    const firstBotId = userBotIds[0];
    const secondBotId = userBotIds[1];
    await switchUserIdBetweenLinkedBotIds(firstBotId);
    const firstBotDoc = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == firstBotId))
    );
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == firstBotId))
    );

    await switchUserIdBetweenLinkedBotIds(secondBotId);
    const secondBotDoc = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == secondBotId))
    );
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == secondBotId))
    );

    expect(secondBotDoc!.id).toEqual(secondBotId);
    expect(secondBotDoc!.dataFromFirebaseAccount).toBeFalse();
    expect(secondBotDoc!.isBotUserDocument).toBeTrue();
    expect(secondBotDoc!.linkedUserDocumentIds).toEqual(testUser.linkedUserDocumentIds);
    expect(getSignedInUserId()).toEqual(secondBotId);
    expect(auth.currentUser!.uid).toEqual(testUser.id);
    await Promise.all([
      checkNewlyCreatedUser(firstBotId, firstBotDoc!.email, firstBotDoc!.username),
      checkNewlyCreatedUser(secondBotId, secondBotDoc!.email, secondBotDoc!.username),
    ]);
  });

  it("Changes the user's username when signed in with a linked bot id.", async () => {
    const botId = userBotIds[0];
    await switchUserIdBetweenLinkedBotIds(botId);
    let botDoc = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == botId))
    );
    const oldModificationTime = botDoc!.modificationTime.toMillis();
    const newUsername = "changed " + botDoc!.username;
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == botId))
    );

    await changeCurrentUserUsername(newUsername);
    botDoc = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == botId && user.username == newUsername))
    );

    expect(botDoc!.id).toEqual(botId);
    expect(botDoc!.username).toEqual(newUsername);
    expect(botDoc!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    expect(botDoc!.dataFromFirebaseAccount).toBeFalse();
    expect(botDoc!.isBotUserDocument).toBeTrue();
    expect(botDoc!.linkedUserDocumentIds).toEqual(testUser.linkedUserDocumentIds);
    expect(getSignedInUserId()).toEqual(botId);
    expect(auth.currentUser!.uid).toEqual(testUser.id);
    await checkNewlyCreatedUser(botId, botDoc!.email, botDoc!.username);
  });

  it("Creates and opens the workspace when signed in with a linked bot id.", async () => {
    const botId = userBotIds[0];
    await switchUserIdBetweenLinkedBotIds(botId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == botId))
    );

    const workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    const workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );

    expect(workspace!.userIds).toEqual([botId]);
    expect(getOpenWorkspaceId()).toEqual(workspaceId);
    expect(getSignedInUserId()).toEqual(botId);
    expect(auth.currentUser!.uid).toEqual(testUser.id);
    await Promise.all([
      checkNewlyCreatedWorkspace(
        workspaceId,
        workspace!.url,
        workspace!.title,
        workspace!.description
      ),
      checkUser(botId),
    ]);
  });

  it(
    "Closes the open workspace when signing in with a linked bot id who does not belong " +
      "to the open workspace.",
    async () => {
      const botId = userBotIds[0];
      const workspaceId = await createTestWorkspace(filename);
      setOpenWorkspaceId(workspaceId);
      let workspace = await firstValueFrom(
        listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
      );
      expect(workspace!.userIds).toEqual([testUser.id]);

      await switchUserIdBetweenLinkedBotIds(botId);
      workspace = await firstValueFrom(
        listenOpenWorkspace().pipe(filter((workspace) => workspace == null))
      );

      expect(workspace).toBeNull();
      expect(getOpenWorkspaceId()).toBeNull();
      expect(getSignedInUserId()).toEqual(botId);
      expect(auth.currentUser!.uid).toEqual(testUser.id);
      // Current user id must be set to the workspace creator to check the newly created workspace.
      await switchUserIdBetweenLinkedBotIds(testUser.id);
      await checkWorkspace(workspaceId);
    }
  );

  it("Changes the workspace title when signed in with a linked bot id.", async () => {
    const botId = userBotIds[0];
    await switchUserIdBetweenLinkedBotIds(botId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == botId))
    );
    const workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime.toMillis();
    const newTitle = "changed " + workspace!.title;

    await changeWorkspaceTitle(newTitle);
    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.title == newTitle)
      )
    );

    expect(workspace!.title).toEqual(newTitle);
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    expect(workspace!.userIds).toEqual([botId]);
    expect(getOpenWorkspaceId()).toEqual(workspaceId);
    expect(getSignedInUserId()).toEqual(botId);
    expect(auth.currentUser!.uid).toEqual(testUser.id);
    await checkNewlyCreatedWorkspace(workspaceId, workspace!.url, newTitle, workspace!.description);
  });

  it("Invites a linked bot to a workspace.", async () => {
    const botId = userBotIds[0];
    const workspaceId = await createTestWorkspace(filename);
    const botDoc = (await adminCollections.users.doc(botId).get()).data();
    const botEmail = botDoc!.email;
    setOpenWorkspaceId(workspaceId);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime.toMillis();

    await inviteUserToWorkspace(botEmail);
    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId && workspace.invitedUserEmails.includes(botEmail)
        )
      )
    );

    expect(workspace!.invitedUserEmails).toEqual([botEmail]);
    expect(workspace!.userIds).toEqual([testUser.id]);
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    expect(getOpenWorkspaceId()).toEqual(workspaceId);
    expect(getSignedInUserId()).toEqual(testUser.id);
    expect(auth.currentUser!.uid).toEqual(testUser.id);
    await checkWorkspace(workspaceId);
  });

  it("Accepts a workspace invitation when signed in with a linked bot id.", async () => {
    const botId = userBotIds[0];
    const workspaceId = await createTestWorkspace(filename);
    let botDoc = (await adminCollections.users.doc(botId).get()).data();
    const botEmail = botDoc!.email;
    setOpenWorkspaceId(workspaceId);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime.toMillis();
    await inviteUserToWorkspace(botEmail);
    await switchUserIdBetweenLinkedBotIds(botId);
    expect(getOpenWorkspaceId()).toBeNull();
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == botId && user.workspaceInvitationIds.includes(workspaceId))
      )
    );
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == botId))
    );

    await acceptWorkspaceInvitation(workspaceId);
    botDoc = (await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == botId && user.workspaceIds.includes(workspaceId))
      )
    ))!;
    setOpenWorkspaceId(workspaceId);
    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );

    expect(botDoc.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(botDoc.workspaceIds).toEqual([workspaceId]);
    expect(botDoc.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.userIds).toEqual([testUser.id, botId].sort());
    expect(workspace!.modificationTime.toMillis()).toBeGreaterThan(oldModificationTime);
    expect(getOpenWorkspaceId()).toEqual(workspaceId);
    expect(getSignedInUserId()).toEqual(botId);
    expect(auth.currentUser!.uid).toEqual(testUser.id);
    await checkWorkspace(workspaceId);
  });
});
