import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import collections from "client/db/collections.firebase";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, getDocs } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test users collection firestore rules denying access.", () => {
  let signedUserId: string;
  let otherUserId: string;
  const filename = path.parse(__filename).name;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Creates test users.
   */
  beforeEach(async () => {
    const testUsers = await registerAndCreateTestUserDocuments(2);
    signedUserId = testUsers[0].uid;
    otherUserId = testUsers[1].uid;
  });

  it("The signed in user can't read an other user document when they both don't belong to any workspace.", async () => {
    expect.assertions(1);
    await signInTestUser(signedUserId);

    await expect(getDoc(doc(collections.users, otherUserId))).rejects.toThrow(FirebaseError);
  });

  it("The signed in user can't read an other user document when they don't belong to the same workspace.", async () => {
    expect.assertions(1);
    await signInTestUser(signedUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == signedUserId))
    );
    await createTestWorkspace(filename);
    await signInTestUser(otherUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == otherUserId))
    );
    await createTestWorkspace(filename);

    await signInTestUser(signedUserId);
    await expect(getDoc(doc(collections.users, otherUserId))).rejects.toThrow(FirebaseError);
  });

  it("The signed in user can't use improper query (hack) to read other user documents.", async () => {
    expect.assertions(9);
    await signInTestUser(signedUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == signedUserId))
    );
    const signedInUserWorkspaceId = await createTestWorkspace(filename);
    await signInTestUser(otherUserId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == otherUserId))
    );
    const otherUserWorkspaceId = await createTestWorkspace(filename);

    await signInTestUser(signedUserId);

    let query = collections.users.where("workspaceIds", "array-contains", otherUserWorkspaceId);
    await expect(getDocs(query)).rejects.toThrow(FirebaseError);
    query = collections.users.where("workspaceIds", "array-contains-any", [otherUserWorkspaceId]);
    await expect(getDocs(query)).rejects.toThrow(FirebaseError);
    query = collections.users.where("workspaceIds", "array-contains-any", [
      signedInUserWorkspaceId,
      otherUserWorkspaceId,
    ]);
    await expect(getDocs(query)).rejects.toThrow(FirebaseError);
    query = collections.users.where("workspaceIds", "==", []);
    await expect(getDocs(query)).rejects.toThrow(FirebaseError);
    query = collections.users.where("workspaceIds", "==", [otherUserWorkspaceId]);
    await expect(getDocs(query)).rejects.toThrow(FirebaseError);
    query = collections.users.where("workspaceIds", "==", [
      signedInUserWorkspaceId,
      otherUserWorkspaceId,
    ]);
    await expect(getDocs(query)).rejects.toThrow(FirebaseError);
    query = collections.users.where("workspaceIds", "!=", []);
    await expect(getDocs(query)).rejects.toThrow(FirebaseError);
    query = collections.users.where("workspaceIds", "!=", [signedInUserWorkspaceId]);
    await expect(getDocs(query)).rejects.toThrow(FirebaseError);
    query = collections.users.where("workspaceIds", "!=", [
      signedInUserWorkspaceId,
      otherUserWorkspaceId,
    ]);
    await expect(getDocs(query)).rejects.toThrow(FirebaseError);
  });
});
