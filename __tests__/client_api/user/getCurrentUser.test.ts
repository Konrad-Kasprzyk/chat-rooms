import { signInWithEmailAndPassword } from "firebase/auth";
import { Subscription } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { changeCurrentUserUsername, getCurrentUser } from "../../../client_api/user.api";
import { auth } from "../../../db/firebase";
import { adminAuth, adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../../global/constants/collections";
import createUserModel from "../../../global/utils/admin_utils/createUserModel";

describe("Test pack", () => {
  const description = "Test client api returning subject listening current user document";
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
    await createUserModel(uid, email, username);
  });
  afterAll(async () => {
    await auth.signOut();
    await adminAuth.deleteUser(uid);
  });

  describe(description, () => {
    it("Throws error when user is not logged in", () => {
      expect(() => getCurrentUser()).toThrow();
    });
  });

  describe(description, () => {
    let userSubscription: Subscription | undefined;
    beforeAll(async () => {
      await signInWithEmailAndPassword(auth, email, password);
    });
    afterAll(() => {
      if (userSubscription) userSubscription.unsubscribe();
    });

    it("Returns a user model", async () => {
      let testCompleted = false;
      const userSubject = getCurrentUser();

      userSubscription = userSubject.subscribe((user) => {
        if (!user) return;
        expect(user.id).toEqual(uid);
        expect(user.email).toEqual(email);
        expect(user.username).toEqual(username);
        expect(user.shortId).toBeString();
        expect(user.workspaces).toBeArray();
        expect(user.workspaceInvitations).toBeArray();
        testCompleted = true;
      });

      while (!testCompleted) await new Promise((f) => setTimeout(f, 200));
      expect(testCompleted).toBeTrue();
    });
  });

  describe(description, () => {
    let userSubscription: Subscription | undefined;
    afterAll(() => {
      if (userSubscription) userSubscription.unsubscribe();
    });

    it("Updates user when username changes", async () => {
      let testCompleted = false;
      let usernameChanged = false;
      const newUsername = "changed " + username;
      const userSubject = getCurrentUser();

      userSubscription = userSubject.subscribe((user) => {
        if (!user) return;
        if (!usernameChanged) {
          expect(user.username).toEqual(username);
          usernameChanged = true;
          changeCurrentUserUsername(newUsername);
          return;
        }
        expect(user.username).toEqual(newUsername);
        testCompleted = true;
      });

      while (!testCompleted) await new Promise((f) => setTimeout(f, 200));
      expect(testCompleted).toBeTrue();
    });
  });

  describe(description, () => {
    let userSubscription: Subscription | undefined;
    afterAll(() => {
      if (userSubscription) userSubscription.unsubscribe();
    });

    it("Sends null when user document is deleted", async () => {
      let testCompleted = false;
      let userDocumentDeleted = false;
      const userSubject = getCurrentUser();

      userSubscription = userSubject.subscribe((user) => {
        if (!user && userDocumentDeleted) testCompleted = true;
        if (user) {
          userDocumentDeleted = true;
          adminDb.collection(COLLECTIONS.users).doc(uid).delete();
        }
      });

      while (!testCompleted) await new Promise((f) => setTimeout(f, 200));
      expect(testCompleted).toBeTrue();
    });
  });
});
