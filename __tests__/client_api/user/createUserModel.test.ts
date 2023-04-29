import { exportedForTesting } from "../../../client_api/user.api";
import { auth } from "../../../db/firebase";
import { adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../../global/constants/collections";
import User from "../../../global/models/user.model";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../../global/utils/admin_utils/emailPasswordUser";

const { createUserModel } = exportedForTesting;

describe("Test pack", () => {
  const description = "Test client api creating user model";
  let email = "";
  let password = "";
  const username = "Jeff";
  let uid = "";
  beforeAll(async () => {
    if (!createUserModel) throw "Imported function createUserModel is undefined.";
    email = getUniqueEmail();
    password = getRandomPassword();
    uid = await registerUserEmailPassword(email, password, username);
  });
  afterAll(async () => {
    await auth.signOut();
    await deleteRegisteredUsersAndUserDocuments([email]);
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
      await signInEmailPasswordAndGetIdToken(email, password);
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
