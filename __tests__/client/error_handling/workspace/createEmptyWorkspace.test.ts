import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import signOut from "client_api/user/signOut.api";
import createEmptyWorkspace from "client_api/workspace/createEmptyWorkspace.api";
import auth from "common/db/auth.firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of creating an empty workspace.", () => {
  let userId: string;

  beforeAll(async () => {
    await globalBeforeAll();
    userId = (await registerAndCreateTestUserDocuments(1))[0].uid;
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Sings in the test user.
   */
  beforeEach(async () => {
    if (!auth.currentUser || auth.currentUser.uid !== userId) await signInTestUser(userId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == userId)));
  });

  it("The provided url is an empty string.", async () => {
    expect.assertions(1);

    await expect(createEmptyWorkspace("", "foo", "foo")).rejects.toThrow(
      "The provided url is an empty string."
    );
  });

  it("The provided title is an empty string.", async () => {
    expect.assertions(1);

    await expect(createEmptyWorkspace("foo", "", "foo")).rejects.toThrow(
      "The provided title is an empty string."
    );
  });

  it("Current user document not found, because has the deleted flag set.", async () => {
    expect.assertions(1);
    await adminCollections.users.doc(userId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user == null)));

    await expect(createEmptyWorkspace("foo", "foo", "foo")).rejects.toThrow(
      "User document not found."
    );

    await adminCollections.users.doc(userId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });
  });

  it("Current user document not found, because the user is signed out.", async () => {
    expect.assertions(1);
    await signOut();
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user == null)));

    await expect(createEmptyWorkspace("foo", "foo", "foo")).rejects.toThrow(
      "User document not found."
    );
  });
});
