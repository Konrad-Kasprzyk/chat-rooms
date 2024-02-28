import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkNewlyCreatedUser from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedUser.util";
import checkNewlyCreatedWorkspace from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedWorkspace.util";
import checkUser from "__tests__/utils/checkDTODocs/usableOrInBin/checkUser.util";
import checkWorkspace from "__tests__/utils/checkDTODocs/usableOrInBin/checkWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import acceptWorkspaceInvitation from "client/api/user/acceptWorkspaceInvitation.api";
import changeCurrentUserUsername from "client/api/user/changeCurrentUserUsername.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import { getSignedInUserId } from "client/api/user/signedInUserId.utils";
import switchUserIdBetweenLinkedBotIds from "client/api/user/switchUserIdBetweenLinkedBotIds.util";
import changeWorkspaceTitle from "client/api/workspace/changeWorkspaceTitle.api";
import inviteUserToWorkspace from "client/api/workspace/inviteUserToWorkspace.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import { getOpenWorkspaceId, setOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import listenWorkspaceSummaries from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import auth from "client/db/auth.firebase";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test changing the signed in user id between linked bot ids.", () => {
  let testUserId: string;
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
    testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    const testUserDetails = (await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
    ))!;
    userBotIds = testUserDetails.linkedUserDocumentIds.filter((uid) => uid != testUserId);
  });

  afterEach(async () => {
    await checkUser(testUserId);
  });

  it("Switches the signed in user id to a linked bot id.", async () => {
    const botId = userBotIds[0];

    await switchUserIdBetweenLinkedBotIds(botId);
    const botUser = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == botId))
    );
    const botUserDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == botId))
    );

    const mainUserDetails = (await adminCollections.userDetails.doc(testUserId).get()).data();
    expect(botUser!.id).toEqual(botId);
    expect(botUser!.isBotUserDocument).toBeTrue();
    expect(botUserDetails!.id).toEqual(botId);
    expect(botUserDetails!.linkedUserDocumentIds).toEqual(mainUserDetails!.linkedUserDocumentIds);
    expect(getSignedInUserId()).toEqual(botId);
    expect(auth.currentUser!.uid).toEqual(testUserId);

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
    const secondBotUserDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == secondBotId))
    );

    const mainUserDetails = (await adminCollections.userDetails.doc(testUserId).get()).data();
    expect(secondBotDoc!.id).toEqual(secondBotId);
    expect(secondBotDoc!.isBotUserDocument).toBeTrue();
    expect(secondBotUserDetails!.id).toEqual(secondBotId);
    expect(secondBotUserDetails!.linkedUserDocumentIds).toEqual(
      mainUserDetails!.linkedUserDocumentIds
    );
    expect(getSignedInUserId()).toEqual(secondBotId);
    expect(auth.currentUser!.uid).toEqual(testUserId);
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
    const oldModificationTime = botDoc!.modificationTime;
    const newUsername = "changed " + botDoc!.username;
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == botId))
    );

    await changeCurrentUserUsername(newUsername);
    botDoc = await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == botId && user.username == newUsername))
    );
    const botUserDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == botId))
    );

    const mainUserDetails = (await adminCollections.userDetails.doc(testUserId).get()).data();
    expect(botDoc!.id).toEqual(botId);
    expect(botDoc!.username).toEqual(newUsername);
    expect(botDoc!.modificationTime).toBeAfter(oldModificationTime);
    expect(botDoc!.isBotUserDocument).toBeTrue();
    expect(botUserDetails!.id).toEqual(botId);
    expect(botUserDetails!.linkedUserDocumentIds).toEqual(mainUserDetails!.linkedUserDocumentIds);
    expect(getSignedInUserId()).toEqual(botId);
    expect(auth.currentUser!.uid).toEqual(testUserId);
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

    const userDetailsDTO = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toEqual([workspaceId]);
    expect(workspace!.userIds).toEqual([botId]);
    expect(getOpenWorkspaceId()).toEqual(workspaceId);
    expect(getSignedInUserId()).toEqual(botId);
    expect(auth.currentUser!.uid).toEqual(testUserId);
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
      expect(workspace!.userIds).toEqual([testUserId]);

      await switchUserIdBetweenLinkedBotIds(botId);
      workspace = await firstValueFrom(
        listenOpenWorkspace().pipe(filter((workspace) => workspace == null))
      );

      const userDetailsDTO = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
      expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toEqual([workspaceId]);
      expect(workspace).toBeNull();
      expect(getOpenWorkspaceId()).toBeNull();
      expect(getSignedInUserId()).toEqual(botId);
      expect(auth.currentUser!.uid).toEqual(testUserId);
      // Current user id must be set to the workspace creator to check the newly created workspace.
      await switchUserIdBetweenLinkedBotIds(testUserId);
      await checkNewlyCreatedWorkspace(workspaceId);
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
    const oldModificationTime = workspace!.modificationTime;
    const newTitle = "changed " + workspace!.title;

    await changeWorkspaceTitle(newTitle);
    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter((workspace) => workspace?.id == workspaceId && workspace.title == newTitle)
      )
    );

    const userDetailsDTO = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toEqual([workspaceId]);
    expect(workspace!.title).toEqual(newTitle);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    expect(workspace!.userIds).toEqual([botId]);
    expect(getOpenWorkspaceId()).toEqual(workspaceId);
    expect(getSignedInUserId()).toEqual(botId);
    expect(auth.currentUser!.uid).toEqual(testUserId);
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
    const oldModificationTime = workspace!.modificationTime;

    await inviteUserToWorkspace(botEmail);
    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId && workspace.invitedUserEmails.includes(botEmail)
        )
      )
    );

    const userDetailsDTO = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toEqual([workspaceId]);
    expect(workspace!.invitedUserEmails).toEqual([botEmail]);
    expect(workspace!.userIds).toEqual([testUserId]);
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    expect(getOpenWorkspaceId()).toEqual(workspaceId);
    expect(getSignedInUserId()).toEqual(testUserId);
    expect(auth.currentUser!.uid).toEqual(testUserId);
    await checkWorkspace(workspaceId);
  });

  it("Accepts a workspace invitation when signed in with a linked bot id.", async () => {
    const botId = userBotIds[0];
    const workspaceId = await createTestWorkspace(filename);
    const botDocDTO = (await adminCollections.users.doc(botId).get()).data();
    const botEmail = botDocDTO!.email;
    setOpenWorkspaceId(workspaceId);
    let workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
    const oldModificationTime = workspace!.modificationTime;
    await inviteUserToWorkspace(botEmail);
    await switchUserIdBetweenLinkedBotIds(botId);
    expect(getOpenWorkspaceId()).toBeNull();
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == botId && user.workspaceInvitationIds.includes(workspaceId))
      )
    );

    await acceptWorkspaceInvitation(workspaceId);
    const botDoc = (await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == botId && user.workspaceIds.includes(workspaceId))
      )
    ))!;
    setOpenWorkspaceId(workspaceId);
    workspace = await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );

    const userDetailsDTO = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toEqual([workspaceId]);
    expect(botDoc.workspaceInvitationIds).toBeArrayOfSize(0);
    expect(botDoc.workspaceIds).toEqual([workspaceId]);
    expect(botDoc.modificationTime).toBeAfter(oldModificationTime);
    expect(workspace!.invitedUserEmails).toBeArrayOfSize(0);
    expect(workspace!.userIds).toEqual([testUserId, botId].sort());
    expect(workspace!.modificationTime).toBeAfter(oldModificationTime);
    expect(getOpenWorkspaceId()).toEqual(workspaceId);
    expect(getSignedInUserId()).toEqual(botId);
    expect(auth.currentUser!.uid).toEqual(testUserId);
    await checkWorkspace(workspaceId);
  });

  it("Properly updates the workspace summaries when signed in with a linked bot id.", async () => {
    const botId = userBotIds[0];
    await switchUserIdBetweenLinkedBotIds(botId);
    const workspaceSummariesListener = listenWorkspaceSummaries();
    await firstValueFrom(
      workspaceSummariesListener.pipe(
        filter((workspaceSummaries) => workspaceSummaries.docs.length == 0)
      )
    );

    const workspaceId = await createTestWorkspace(filename);
    const workspaceSummaries = await firstValueFrom(
      workspaceSummariesListener.pipe(
        filter((workspaceSummaries) => workspaceSummaries.docs.length == 1)
      )
    );

    const userDetailsDTO = (await adminCollections.userDetails.doc(testUserId).get()).data()!;
    expect(userDetailsDTO.allLinkedUserBelongingWorkspaceIds).toEqual([workspaceId]);
    expect(workspaceSummaries.docs).toBeArrayOfSize(1);
    expect(workspaceSummaries.docs[0].id).toEqual(workspaceId);
    expect(workspaceSummaries.updates).toBeArrayOfSize(1);
    expect(workspaceSummaries.updates[0].type).toEqual("added");
    expect(workspaceSummaries.updates[0].doc.id).toEqual(workspaceId);
    expect(getSignedInUserId()).toEqual(botId);
    expect(auth.currentUser!.uid).toEqual(testUserId);
    await checkWorkspace(workspaceId);
  });
});
