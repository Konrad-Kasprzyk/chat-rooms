import { changeCurrentUserUsername } from "../../../client_api/user.api";
import { auth } from "../../../db/firebase";
import { adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../../global/constants/collections";
import User from "../../../global/models/user.model";
import createUserModel from "../../../global/utils/admin_utils/createUserModel";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../../global/utils/admin_utils/emailPasswordUser";

describe("Test pack", () => {
  const description = "Test client api changing current user username";
  let email = "";
  let password = "";
  const username = "Jeff";
  const newUsername = "Bob";
  let idToken = "";
  let uid = "";
  beforeAll(async () => {
    email = getUniqueEmail();
    password = getRandomPassword();
    uid = await registerUserEmailPassword(email, password, username);
    idToken = await signInEmailPasswordAndGetIdToken(email, password);
  });
  afterAll(async () => {
    await auth.signOut();
    await deleteRegisteredUsersAndUserDocuments([email]);
  });

  describe(description, () => {
    it("Throws an error when the user document doesn't exist", async () => {
      await expect(changeCurrentUserUsername(newUsername)).toReject();
    });
  });

  describe(description, () => {
    beforeAll(async () => {
      await createUserModel(uid, email, username);
    });

    it("Properly changes the current user username", async () => {
      const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
      let userSnap = await userRef.get();
      expect(userSnap.exists).toBeTrue();
      let user = userSnap.data() as User;
      expect(user.username).toEqual(username);

      await changeCurrentUserUsername(newUsername);

      userSnap = await userRef.get();
      expect(userSnap.exists).toBeTrue();
      user = userSnap.data() as User;
      expect(user.username).toEqual(newUsername);
    });
  });

  describe(description, () => {
    it("Properly changes the current user username to an empty username", async () => {
      const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
      let userSnap = await userRef.get();
      expect(userSnap.exists).toBeTrue();
      let user = userSnap.data() as User;
      expect(user.username).toEqual(newUsername);

      await changeCurrentUserUsername("");

      userSnap = await userRef.get();
      expect(userSnap.exists).toBeTrue();
      user = userSnap.data() as User;
      expect(user.username).toEqual("");
    });
  });

  describe(description, () => {
    it("Properly changes the current user username from an empty username", async () => {
      const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
      let userSnap = await userRef.get();
      expect(userSnap.exists).toBeTrue();
      let user = userSnap.data() as User;
      expect(user.username).toEqual("");

      await changeCurrentUserUsername(newUsername);

      userSnap = await userRef.get();
      expect(userSnap.exists).toBeTrue();
      user = userSnap.data() as User;
      expect(user.username).toEqual(newUsername);
    });
  });
});
