import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import { removeUsersFromWorkspace } from "__tests__/utils/workspace/removeUsersFromWorkspace.util";
import collections from "clientApi/db/collections.firebase";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import rejectWorkspaceInvitation from "clientApi/user/rejectWorkspaceInvitation.api";
import leaveWorkspace from "clientApi/workspace/leaveWorkspace.api";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, getDocs } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test workspaceSummaries collection firestore rules denying access.", () => {
  let signedUser: {
    uid: string;
    email: string;
    displayName: string;
  };
  let otherUser: {
    uid: string;
    email: string;
    displayName: string;
  };
  const filename = path.parse(__filename).name;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates the test user.
   */
  beforeEach(async () => {
    const testUsers = await registerAndCreateTestUserDocuments(2);
    signedUser = testUsers[0];
    otherUser = testUsers[1];
  });

  it("The signed in user can't get a single workspace summary, even if he belongs to it.", async () => {
    expect.assertions(1);
    await signInTestUser(signedUser.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == signedUser.uid))
    );
    const workspaceId = await createTestWorkspace(filename);

    await expect(getDoc(doc(collections.workspaceSummaries, workspaceId))).rejects.toThrow(
      FirebaseError
    );
  });

  it("The signed in user can't read a workspace summary document to which he does not belong anymore.", async () => {
    expect.assertions(1);
    await signInTestUser(signedUser.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == signedUser.uid))
    );
    const workspaceId = await createTestWorkspace(filename);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == signedUser.uid && user.workspaceIds[0] == workspaceId)
      )
    );
    await leaveWorkspace(workspaceId);

    let query = collections.workspaceSummaries.where("userIds", "array-contains", workspaceId);
    await expect(getDocs(query)).rejects.toThrow(FirebaseError);
  });

  it("The signed in user can't read a workspace summary document when he canceled an invitation to the workspace.", async () => {
    expect.assertions(1);
    await signInTestUser(signedUser.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == signedUser.uid))
    );
    const workspaceId = await createTestWorkspace(filename);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter((user) => user?.id == signedUser.uid && user.workspaceIds[0] == workspaceId)
      )
    );
    await leaveWorkspace(workspaceId);
    await addUsersToWorkspace(workspaceId, [], [signedUser.email]);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) => user?.id == signedUser.uid && user.workspaceInvitationIds[0] == workspaceId
        )
      )
    );
    await rejectWorkspaceInvitation(workspaceId);

    let query = collections.workspaceSummaries.where(
      "invitedUserIds",
      "array-contains",
      workspaceId
    );
    await expect(getDocs(query)).rejects.toThrow(FirebaseError);
  });

  it(
    "The signed in user can't use improper query (hack) to read workspace summary documents to " +
      "which he does not belong and is not invited.",
    async () => {
      expect.assertions(12);
      await signInTestUser(signedUser.uid);
      await firstValueFrom(
        listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == signedUser.uid))
      );
      const signedInUserBelongingWorkspaceId = await createTestWorkspace(filename);
      const signedInUserInvitedWorkspaceId = await createTestWorkspace(filename);
      await removeUsersFromWorkspace(signedInUserInvitedWorkspaceId, [signedUser.uid]);
      await addUsersToWorkspace(signedInUserInvitedWorkspaceId, [], [signedUser.email]);
      await firstValueFrom(
        listenCurrentUser().pipe(
          filter(
            (user) =>
              user?.id == signedUser.uid &&
              user.workspaceIds.length == 1 &&
              user.workspaceInvitationIds.length == 1
          )
        )
      );
      await signInTestUser(otherUser.uid);
      await firstValueFrom(
        listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == otherUser.uid))
      );
      const otherUserBelongingWorkspaceId = await createTestWorkspace(filename);
      const otherUserInvitedWorkspaceId = await createTestWorkspace(filename);
      await removeUsersFromWorkspace(otherUserInvitedWorkspaceId, [otherUser.uid]);
      await addUsersToWorkspace(otherUserInvitedWorkspaceId, [], [otherUser.email]);
      await firstValueFrom(
        listenCurrentUser().pipe(
          filter(
            (user) =>
              user?.id == otherUser.uid &&
              user.workspaceIds.length == 1 &&
              user.workspaceInvitationIds.length == 1
          )
        )
      );

      await signInTestUser(signedUser.uid);

      // valid userIds "array-contains"
      let query = collections.workspaceSummaries.or(
        ["userIds", "array-contains", signedInUserBelongingWorkspaceId],
        ["invitedUserIds", "array-contains", otherUserInvitedWorkspaceId]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);
      query = collections.workspaceSummaries.or(
        ["userIds", "array-contains", signedInUserBelongingWorkspaceId],
        [
          "invitedUserIds",
          "array-contains-any",
          [signedInUserInvitedWorkspaceId, otherUserInvitedWorkspaceId],
        ]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);
      query = collections.workspaceSummaries.or(
        ["userIds", "array-contains", signedInUserBelongingWorkspaceId],
        ["invitedUserIds", "==", []]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);
      query = collections.workspaceSummaries.or(
        ["userIds", "array-contains", signedInUserBelongingWorkspaceId],
        ["invitedUserIds", "!=", []]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);
      query = collections.workspaceSummaries.or(
        ["userIds", "array-contains", signedInUserBelongingWorkspaceId],
        ["invitedUserIds", "==", [signedInUserInvitedWorkspaceId]]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);
      query = collections.workspaceSummaries.or(
        ["userIds", "array-contains", signedInUserBelongingWorkspaceId],
        ["invitedUserIds", "!=", [signedInUserInvitedWorkspaceId]]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);

      // valid invitedUserIds "array-contains"
      query = collections.workspaceSummaries.or(
        ["userIds", "array-contains", otherUserBelongingWorkspaceId],
        ["invitedUserIds", "array-contains", signedInUserInvitedWorkspaceId]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);
      query = collections.workspaceSummaries.or(
        [
          "userIds",
          "array-contains-any",
          [signedInUserBelongingWorkspaceId, otherUserBelongingWorkspaceId],
        ],
        ["invitedUserIds", "array-contains", signedInUserInvitedWorkspaceId]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);
      query = collections.workspaceSummaries.or(
        ["userIds", "==", []],
        ["invitedUserIds", "array-contains", signedInUserInvitedWorkspaceId]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);
      query = collections.workspaceSummaries.or(
        ["userIds", "!=", []],
        ["invitedUserIds", "array-contains", signedInUserInvitedWorkspaceId]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);
      query = collections.workspaceSummaries.or(
        ["userIds", "==", [signedInUserBelongingWorkspaceId]],
        ["invitedUserIds", "array-contains", signedInUserInvitedWorkspaceId]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);
      query = collections.workspaceSummaries.or(
        ["userIds", "!=", [signedInUserBelongingWorkspaceId]],
        ["invitedUserIds", "array-contains", signedInUserInvitedWorkspaceId]
      );
      await expect(getDocs(query)).rejects.toThrow(FirebaseError);
    }
  );
});
