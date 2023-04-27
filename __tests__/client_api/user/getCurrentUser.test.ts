import { Subscription } from "rxjs";
import { changeCurrentUserUsername, getCurrentUser } from "../../../client_api/user.api";
import { adminDb } from "../../../db/firebase-admin";
import createUserModel from "../../../global/utils/admin_utils/createUserModel";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../../global/utils/admin_utils/emailPasswordUser";
import COLLECTIONS from "../../../global/constants/collections";

const usedEmails: string[] = [];
const userSubs: Subscription[] = [];

function getEmail() {
  const email = getUniqueEmail();
  usedEmails.push(email);
  return email;
}

describe("Test client api returning subject listening current user document", () => {
  afterAll(async () => {
    for (const sub of userSubs) sub.unsubscribe();
    await deleteRegisteredUsersAndUserDocuments(usedEmails);
  });

  it("Throws error when user is not logged in", () => {
    expect(() => getCurrentUser()).toThrow();
  });

  it("Returns user model", (done) => {
    async function test() {
      const email = getEmail();
      const password = getRandomPassword();
      const username = "Jeff";
      const uid = await registerUserEmailPassword(email, password, username);
      await signInEmailPasswordAndGetIdToken(email, password);
      await createUserModel(uid, email, username);

      const userSubject = getCurrentUser();
      const userSub = userSubject.subscribe((user) => {
        if (!user) return;
        expect(user.id).toEqual(uid);
        expect(user.email).toEqual(email);
        expect(user.username).toEqual(username);
        expect(user.shortId).toBeString();
        expect(user.workspaces).toBeArray();
        expect(user.workspaceInvitations).toBeArray();
        done();
      });
      userSubs.push(userSub);
    }
    test();
  });

  it("Sends null when user document is deleted", (done) => {
    async function test() {
      let userDocumentDeleted = false;
      const email = getEmail();
      const password = getRandomPassword();
      const username = "Jeff";
      const uid = await registerUserEmailPassword(email, password, username);
      await signInEmailPasswordAndGetIdToken(email, password);
      await createUserModel(uid, email, username);

      const userSubject = getCurrentUser();
      const userSub = userSubject.subscribe(async (user) => {
        if (!user && userDocumentDeleted) done();
        if (user) {
          userDocumentDeleted = true;
          await adminDb.collection(COLLECTIONS.users).doc(uid).delete();
        }
      });
      userSubs.push(userSub);
    }
    test();
  });

  it("Updates user when username changes", (done) => {
    async function test() {
      let usernameChanged = false;
      const email = getEmail();
      const password = getRandomPassword();
      const username = "Jeff";
      const newUsername = "Bob";
      const uid = await registerUserEmailPassword(email, password, username);
      await signInEmailPasswordAndGetIdToken(email, password);
      await createUserModel(uid, email, username);

      const userSubject = getCurrentUser();
      const userSub = userSubject.subscribe(async (user) => {
        if (!user) return;
        if (!usernameChanged) {
          expect(user.username).toEqual(username);
          usernameChanged = true;
          await changeCurrentUserUsername(newUsername);
          return;
        }
        expect(user.username).toEqual(newUsername);
        done();
      });
      userSubs.push(userSub);
    }
    test();
  });
});
