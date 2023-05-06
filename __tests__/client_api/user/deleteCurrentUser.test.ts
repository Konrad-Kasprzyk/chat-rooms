import { signInWithEmailAndPassword } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { deleteCurrentUser } from "../../../client_api/user.api";
import { auth } from "../../../db/firebase";
import { adminAuth, adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../../global/constants/collections";
import createUserModel from "../../../global/utils/admin_utils/createUserModel";

describe("Test pack", () => {
  const description = "Test client api deleting user";
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
    // User with this uid should be already deleted, that's why catch used
    await adminAuth.deleteUser(uid).catch(() => {});
  });

  describe(description, () => {
    it("Throws an error when the user is not logged in", async () => {
      await expect(deleteCurrentUser()).toReject();
    });
  });

  describe(description, () => {
    beforeAll(async () => {
      await signInWithEmailAndPassword(auth, email, password);
    });
    it("Deletes the user when the user document is not created", async () => {
      const userSnap = await adminDb.collection(COLLECTIONS.users).doc(uid).get();
      expect(userSnap.exists).toBeFalse();

      await expect(deleteCurrentUser()).toResolve();

      await expect(adminAuth.getUser(uid)).toReject();
      expect(auth.currentUser).toBeNull();
    });
  });

  describe(description, () => {
    beforeAll(async () => {
      uid = await adminAuth
        .createUser({
          email: email,
          emailVerified: true,
          password: password,
          displayName: displayName,
        })
        .then((userRecord) => userRecord.uid);
      await signInWithEmailAndPassword(auth, email, password);
      await createUserModel(uid, email, username);
    });
    it("Deletes the user when the user document is created", async () => {
      let userSnap = await adminDb.collection(COLLECTIONS.users).doc(uid).get();
      expect(userSnap.exists).toBeTrue();
      await expect(deleteCurrentUser()).toResolve();

      userSnap = await adminDb.collection(COLLECTIONS.users).doc(uid).get();
      expect(userSnap.exists).toBeFalse();
      await expect(adminAuth.getUser(uid)).toReject();
      expect(auth.currentUser).toBeNull();
    });
  });
});
