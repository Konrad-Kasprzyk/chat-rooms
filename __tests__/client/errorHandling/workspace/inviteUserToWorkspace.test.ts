import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testOpenWorkspaceNotFoundError from "__tests__/utils/commonTests/clientErrors/testOpenWorkspaceNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import inviteUserToWorkspace from "clientApi/workspace/inviteUserToWorkspace.api";
import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import MAX_INVITED_USERS from "common/constants/maxInvitedUsers.constant";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of inviting a user to a workspace.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The open workspace document not found.", async () => {
    await testOpenWorkspaceNotFoundError(() => inviteUserToWorkspace("foo"));
  });

  it("The user is already invited to the open workspace.", async () => {
    expect.assertions(1);
    const workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await addUsersToWorkspace(workspaceId, [], [testUser.email]);
    await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId && workspace.invitedUserEmails.includes(testUser.email)
        )
      )
    );

    await expect(inviteUserToWorkspace(testUser.email)).rejects.toThrow(
      `The user with email ${testUser.email} is already invited to the open workspace.`
    );
  });

  it("The open workspace has a maximum number of invited users.", async () => {
    expect.assertions(1);
    const workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    const fakeUserEmails: string[] = [];
    for (let i = 0; i < MAX_INVITED_USERS; i++) fakeUserEmails.push(`fakeEmail${i}@foo`);
    await adminCollections.workspaces.doc(workspaceId).update({
      invitedUserEmails: fakeUserEmails,
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(
        filter(
          (workspace) =>
            workspace?.id == workspaceId && workspace.invitedUserEmails.length >= MAX_INVITED_USERS
        )
      )
    );
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];

    await expect(inviteUserToWorkspace(testUser.email)).rejects.toThrow(
      "The open workspace has a maximum number of invited users."
    );
  });
});
