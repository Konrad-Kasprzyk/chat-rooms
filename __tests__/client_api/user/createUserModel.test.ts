import { signInWithEmailAndPassword } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { exportedForTesting } from "../../../client_api/user.api";
import { auth } from "../../../db/firebase";
import { adminAuth, adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../../global/constants/collections";
import User from "../../../global/models/user.model";

const { createUserModel } = exportedForTesting;

describe("Test pack", () => {
  const description = "Test client api creating user model";
  let uid = "";
  const email = uuidv4() + "@normkeeper-testing.api";
  const password = uuidv4();
  const displayName = "Jeff";
  const username = displayName;
  beforeAll(async () => {
    uid = await adminAuth
      .createUser({
        email: email,
        emailVerified: true,
        password: password,
        displayName: displayName,
      })
      .then((userRecord) => userRecord.uid);
  });
  afterAll(async () => {
    await auth.signOut();
    await adminAuth.deleteUser(uid);
  });

  describe(description, () => {
    it("Throws an error when the user is not logged in", async () => {
      await expect(createUserModel!(email, username)).toReject();

      const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
      const userSnap = await userRef.get();
      expect(userSnap.exists).toBeFalse();
    });
  });

  describe(description, () => {
    beforeAll(async () => {
      await signInWithEmailAndPassword(auth, email, password);
    });

    it("Properly creates the user model", async () => {
      await createUserModel!(email, username);

      const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
      const userSnap = await userRef.get();
      expect(userSnap.exists).toBeTrue();
      const user = userSnap.data() as User;
      expect(user.id).toEqual(uid);
      expect(user.email).toEqual(email);
      expect(user.username).toEqual(username);
      expect(user.shortId).toBeString();
      expect(user.workspaces).toBeArray();
      expect(user.workspaceInvitations).toBeArray();
    });
  });

  describe(description, () => {
    it("Doesn't create the user model, when it already exists", async () => {
      await expect(createUserModel!(email, username)).toReject();

      const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
      const userSnap = await userRef.get();
      expect(userSnap.exists).toBeTrue();
      const user = userSnap.data() as User;
      expect(user.id).toEqual(uid);
      expect(user.email).toEqual(email);
      expect(user.username).toEqual(username);
      expect(user.shortId).toBeString();
      expect(user.workspaces).toBeArray();
      expect(user.workspaceInvitations).toBeArray();
    });
  });
});
