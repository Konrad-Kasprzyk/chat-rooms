import { signInWithEmailAndPassword } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { changeCurrentUserUsername } from "../../../client_api/user.api";
import { auth } from "../../../db/firebase";
import { adminAuth, adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../../global/constants/collections";
import User from "../../../global/models/user.model";
import createUserModel from "../../../global/utils/admin_utils/createUserModel";

describe("Test pack", () => {
  const description = "Test client api changing current user username";
  let uid = "";
  const username = "Jeff";
  const newUsername = "changed " + username;
  const email = uuidv4() + "@normkeeper-testing.api";
  const password = uuidv4();
  beforeAll(async () => {
    uid = await adminAuth
      .createUser({
        email: email,
        emailVerified: true,
        password: password,
        displayName: username,
      })
      .then((userRecord) => userRecord.uid);
    await createUserModel(uid, email, username);
  });
  afterAll(async () => {
    await auth.signOut();
    await adminAuth.deleteUser(uid);
  });

  describe(description, () => {
    it("Throws an error when the user document doesn't exist", async () => {
      await expect(changeCurrentUserUsername(newUsername)).toReject();
    });
  });

  describe(description, () => {
    beforeAll(async () => {
      await signInWithEmailAndPassword(auth, email, password);
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
