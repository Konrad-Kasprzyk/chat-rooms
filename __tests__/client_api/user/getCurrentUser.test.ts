import { Subscription } from "rxjs";
import { changeCurrentUserUsername, getCurrentUser } from "../../../client_api/user.api";
import { auth } from "../../../db/firebase";
import { adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../../global/constants/collections";
import createUserModel from "../../../global/utils/admin_utils/createUserModel";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../../global/utils/admin_utils/emailPasswordUser";

let email = "";
let password = "";
const username = "Jeff";
let uid = "";

describe("Test pack", () => {
  const description = "Test client api returning subject listening current user document";
  beforeAll(async () => {
    email = getUniqueEmail();
    password = getRandomPassword();
    uid = await registerUserEmailPassword(email, password, username);
  });
  afterAll(async () => {
    await auth.signOut();
    await deleteRegisteredUsersAndUserDocuments([email]);
  });

  describe(description, () => {
    it("Throws error when user is not logged in", () => {
      expect(() => getCurrentUser()).toThrow();
    });
  });

  describe(description, () => {
    let userSubscription: Subscription | undefined;
    beforeAll(async () => {
      await signInEmailPasswordAndGetIdToken(email, password);
      await createUserModel(uid, email, username);
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

      while (!testCompleted) await new Promise((f) => setTimeout(f, 300));
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
      const newUsername = "Bob";
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

      while (!testCompleted) await new Promise((f) => setTimeout(f, 300));
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

      while (!testCompleted) await new Promise((f) => setTimeout(f, 300));
      expect(testCompleted).toBeTrue();
    });
  });
});
