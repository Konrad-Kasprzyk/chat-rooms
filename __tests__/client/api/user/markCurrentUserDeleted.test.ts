import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import fetchTestApi from "__tests__/utils/apiRequest/fetchTestApi.util";
import checkDeletedUser from "__tests__/utils/checkDTODocs/deletedOrMarkedAsDeleted/checkDeletedUser.util";
import compareNewestUsersHistoryRecord from "__tests__/utils/compareNewestHistoryRecord/compareNewestUsersHistoryRecord.util";
import MockedFirebaseUser from "__tests__/utils/mockUsers/mockedFirebaseUser.class";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import { removeUsersFromWorkspace } from "__tests__/utils/workspace/removeUsersFromWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import markCurrentUserDeleted from "client/api/user/markCurrentUserDeleted.api";
import { getSignedInUserId } from "client/api/user/signedInUserId.utils";
import { getOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import auth from "client/db/auth.firebase";
import handleApiResponse from "client/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import path from "path";
import { filter, firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";

describe("Test marking the current user deleted.", () => {
  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it(
    "Marks the current user as deleted if the user does not belong to any workspace " +
      "and is not invited to any workspace.",
    async () => {
      const actualAuth =
        jest.requireActual<typeof import("client/db/auth.firebase")>(
          "client/db/auth.firebase"
        ).default;
      const email = uuidv4() + "@normkeeper.vercel.app";
      const testPassword = "admin1";
      const realUserCredential = await createUserWithEmailAndPassword(
        actualAuth,
        email,
        testPassword
      );
      const testUserId = realUserCredential.user.uid;
      const filename = path.parse(__filename).name;
      const displayName = "Testing user from file: " + filename;
      MockedFirebaseUser.registeredMockUsers.push(
        new MockedFirebaseUser(testUserId, email, displayName)
      );
      const res = await fetchTestApi(CLIENT_API_URLS.user.createUserDocument, {
        uid: testUserId,
        email,
        username: displayName,
      });
      await handleApiResponse(res);
      // Sign in the real user
      await signInWithEmailAndPassword(actualAuth, email, testPassword);
      // Sign in the mocked user
      await signInTestUser(testUserId);
      const testUserDoc = await firstValueFrom(
        listenCurrentUser().pipe(filter((user) => user?.id == testUserId))
      );
      expect(testUserDoc!.isBotUserDocument).toBeFalse();
      const testUserDetailsDoc = await firstValueFrom(
        listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUserId))
      );
      expect(testUserDetailsDoc!.linkedUserDocumentIds).toBeArrayOfSize(USER_BOTS_COUNT + 1);

      await markCurrentUserDeleted();

      // Test that signing out when the user account does not exist does not throw an error.
      await actualAuth.signOut();
      expect(actualAuth.currentUser).toBeNull();
      await expect(signInWithEmailAndPassword(actualAuth, email, testPassword)).rejects.toThrow(
        "Firebase: Error (auth/user-not-found)."
      );
      expect(getSignedInUserId()).toBeNull();
      expect(getOpenWorkspaceId()).toBeNull();
      await firstValueFrom(listenCurrentUser().pipe(filter((user) => user == null)));
      await firstValueFrom(
        listenCurrentUserDetails().pipe(filter((userDetails) => userDetails == null))
      );
      await Promise.all(
        testUserDetailsDoc!.linkedUserDocumentIds.map((uid) => checkDeletedUser(uid))
      );
    }
  );

  it(
    "Marking a user as deleted removes the user's id from belonging to " +
      "and being invited to workspaces.",
    async () => {
      const actualAuth =
        jest.requireActual<typeof import("client/db/auth.firebase")>(
          "client/db/auth.firebase"
        ).default;
      const testUserEmail = uuidv4() + "@normkeeper.vercel.app";
      const testPassword = "admin1";
      const realUserCredential = await createUserWithEmailAndPassword(
        actualAuth,
        testUserEmail,
        testPassword
      );
      const testUserId = realUserCredential.user.uid;
      const filename = path.parse(__filename).name;
      const displayName = "Testing user from file: " + filename;
      MockedFirebaseUser.registeredMockUsers.push(
        new MockedFirebaseUser(testUserId, testUserEmail, displayName)
      );
      const res = await fetchTestApi(CLIENT_API_URLS.user.createUserDocument, {
        uid: testUserId,
        email: testUserEmail,
        username: displayName,
      });
      await handleApiResponse(res);
      // Sign in the real user
      await signInWithEmailAndPassword(actualAuth, testUserEmail, testPassword);
      // Sign in the mocked user
      await signInTestUser(testUserId);
      const userDetailsListener = listenCurrentUserDetails();
      const userDetails = await firstValueFrom(
        userDetailsListener.pipe(filter((userDetails) => userDetails?.id == testUserId))
      );
      const belongingWorkspaceId = await createTestWorkspace(filename);
      const invitedWorkspaceId = await createTestWorkspace(filename);
      await removeUsersFromWorkspace(invitedWorkspaceId, [testUserId]);
      await addUsersToWorkspace(invitedWorkspaceId, [], [testUserEmail]);
      const userListener = listenCurrentUser();
      const userDoc = await firstValueFrom(
        userListener.pipe(
          filter(
            (user) =>
              user?.id == testUserId &&
              user.workspaceIds.length == 1 &&
              user.workspaceInvitationIds.length == 1
          )
        )
      );
      expect(userDoc!.workspaceIds).toEqual([belongingWorkspaceId]);
      expect(userDoc!.workspaceInvitationIds).toEqual([invitedWorkspaceId]);

      await markCurrentUserDeleted();

      expect(auth.currentUser).toBeNull();
      expect(getSignedInUserId()).toBeNull();
      expect(getOpenWorkspaceId()).toBeNull();
      await firstValueFrom(userListener.pipe(filter((user) => user == null)));
      await firstValueFrom(userDetailsListener.pipe(filter((userDetails) => userDetails == null)));
      await Promise.all(userDetails!.linkedUserDocumentIds.map((uid) => checkDeletedUser(uid)));
      const belongingWorkspaceDTO = (
        await adminCollections.workspaces.doc(belongingWorkspaceId).get()
      ).data()!;
      const invitedWorkspaceDTO = (
        await adminCollections.workspaces.doc(invitedWorkspaceId).get()
      ).data()!;
      expect(belongingWorkspaceDTO.modificationTime).toEqual(invitedWorkspaceDTO.modificationTime);
      expect(belongingWorkspaceDTO.userIds).toBeArrayOfSize(0);
      expect(invitedWorkspaceDTO.invitedUserEmails).toBeArrayOfSize(0);
      await compareNewestUsersHistoryRecord(belongingWorkspaceDTO, {
        action: "userRemovedFromWorkspace",
        userId: testUserId,
        date: belongingWorkspaceDTO.modificationTime.toDate(),
        oldValue: {
          id: testUserId,
          email: testUserEmail,
          username: displayName,
          isBotUserDocument: false,
        },
        value: null,
      });
      await compareNewestUsersHistoryRecord(invitedWorkspaceDTO, {
        action: "invitedUserEmails",
        userId: testUserId,
        date: belongingWorkspaceDTO.modificationTime.toDate(),
        oldValue: testUserEmail,
        value: null,
      });
    }
  );
});
