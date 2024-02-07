import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import checkDeletedUser from "__tests__/utils/checkDTODocs/deletedOrMarkedAsDeleted/checkDeletedUser.util";
import checkNewlyCreatedUser from "__tests__/utils/checkDTODocs/newlyCreated/checkNewlyCreatedUser.util";
import checkUser from "__tests__/utils/checkDTODocs/usableOrInBin/checkUser.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import { addUsersToWorkspace } from "__tests__/utils/workspace/addUsersToWorkspace.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import hideWorkspaceInvitation from "client/api/user/hideWorkspaceInvitation.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import signOut from "client/api/user/signOut.api";
import uncoverWorkspaceInvitation from "client/api/user/uncoverWorkspaceInvitation.api";
import { FieldValue } from "firebase-admin/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test client api returning subject listening current user details document.", () => {
  let testUser: Readonly<{
    uid: string;
    email: string;
    displayName: string;
  }>;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates and signs in the new test user for each test.
   * Awaits for user and user details documents to be inside listeners.
   */
  beforeEach(async () => {
    testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == testUser.uid)));
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
  });

  it("Returns a null when the user is not signed in.", async () => {
    await signOut();

    const currentUserDetails = await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails == null))
    );

    expect(currentUserDetails).toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });

  it("Returns the user details document.", async () => {
    const currentUserDetails = await firstValueFrom(listenCurrentUserDetails());

    expect(currentUserDetails).not.toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });

  it("Returns the updated user details document when the user hides an invitation.", async () => {
    const currentUserDetailsListener = listenCurrentUserDetails();
    const workspacesOwner = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspacesOwner.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspacesOwner.uid)
      )
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    await addUsersToWorkspace(workspaceId, [], [testUser.email]);
    await signInTestUser(testUser.uid);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) => user?.id == testUser.uid && user.workspaceInvitationIds.includes(workspaceId)
        )
      )
    );
    let userDetails = await firstValueFrom(
      currentUserDetailsListener.pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    expect(userDetails!.hiddenWorkspaceInvitationIds).toBeArrayOfSize(0);

    hideWorkspaceInvitation(workspaceId);
    userDetails = await firstValueFrom(
      currentUserDetailsListener.pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid &&
            userDetails.hiddenWorkspaceInvitationIds.includes(workspaceId)
        )
      )
    );

    expect(userDetails!.hiddenWorkspaceInvitationIds).toEqual([workspaceId]);
    await checkUser(testUser.uid);
  });

  it("Returns the updated user details document when the user uncovers an invitation.", async () => {
    const currentUserDetailsListener = listenCurrentUserDetails();
    const workspacesOwner = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(workspacesOwner.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspacesOwner.uid)
      )
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    await addUsersToWorkspace(workspaceId, [], [testUser.email]);
    await signInTestUser(testUser.uid);
    await firstValueFrom(
      listenCurrentUser().pipe(
        filter(
          (user) => user?.id == testUser.uid && user.workspaceInvitationIds.includes(workspaceId)
        )
      )
    );
    await firstValueFrom(
      currentUserDetailsListener.pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    await hideWorkspaceInvitation(workspaceId);
    let userDetails = await firstValueFrom(
      currentUserDetailsListener.pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid &&
            userDetails.hiddenWorkspaceInvitationIds.includes(workspaceId)
        )
      )
    );
    expect(userDetails!.hiddenWorkspaceInvitationIds).toEqual([workspaceId]);

    uncoverWorkspaceInvitation(workspaceId);
    userDetails = await firstValueFrom(
      currentUserDetailsListener.pipe(
        filter(
          (userDetails) =>
            userDetails?.id == testUser.uid && userDetails.hiddenWorkspaceInvitationIds.length == 0
        )
      )
    );

    expect(userDetails!.hiddenWorkspaceInvitationIds).toBeArrayOfSize(0);
    await checkUser(testUser.uid);
  });

  it("Returns the user details document after signing out and in.", async () => {
    const currentUserDetailsListener = listenCurrentUserDetails();
    await signOut();
    await firstValueFrom(
      currentUserDetailsListener.pipe(filter((userDetails) => userDetails == null))
    );
    await signInTestUser(testUser.uid);

    const currentUserDetails = await firstValueFrom(
      currentUserDetailsListener.pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );

    expect(currentUserDetails).not.toBeNull();
    await checkNewlyCreatedUser(testUser.uid, testUser.email, testUser.displayName);
  });

  it("Sends null when user and user details documents are marked as deleted", async () => {
    const currentUserDetailsListener = listenCurrentUserDetails();

    await Promise.all([
      adminCollections.users
        .doc(testUser.uid)
        .update({ isDeleted: true, modificationTime: FieldValue.serverTimestamp() }),
      adminCollections.userDetails.doc(testUser.uid).update({ isDeleted: true }),
    ]);
    const currentUserDetails = await firstValueFrom(
      currentUserDetailsListener.pipe(filter((userDetails) => userDetails == null))
    );

    expect(currentUserDetails).toBeNull();
    await checkDeletedUser(testUser.uid);
  });

  it("Sends null when user and user details documents are deleted.", async () => {
    const currentUserDetailsListener = listenCurrentUserDetails();

    await Promise.all([
      adminCollections.users.doc(testUser.uid).delete(),
      adminCollections.userDetails.doc(testUser.uid).delete(),
    ]);
    const currentUserDetails = await firstValueFrom(
      currentUserDetailsListener.pipe(filter((userDetails) => userDetails == null))
    );

    expect(currentUserDetails).toBeNull();
    await checkDeletedUser(testUser.uid);
  });
});
