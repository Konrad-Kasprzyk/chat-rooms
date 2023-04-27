import { changeCurrentUserUsername } from "../../../client_api/user.api";
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

const usedEmails: string[] = [];

function getEmail() {
  const email = getUniqueEmail();
  usedEmails.push(email);
  return email;
}

describe("Test client api changing current user username", () => {
  afterAll(async () => await deleteRegisteredUsersAndUserDocuments(usedEmails));

  it("Properly changes current user username", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const uid = await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);
    await createUserModel(uid, email, username);
    const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
    let userSnap = await userRef.get();
    expect(userSnap.exists).toBeTrue();
    let user = userSnap.data() as User;
    expect(user.username).toEqual(username);

    const newUsername = "Bob";
    await changeCurrentUserUsername(newUsername);

    userSnap = await userRef.get();
    expect(userSnap.exists).toBeTrue();
    user = userSnap.data() as User;
    expect(user.username).toEqual(newUsername);
  });

  it("Properly changes current user username to an empty username", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const uid = await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);
    await createUserModel(uid, email, username);
    const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
    let userSnap = await userRef.get();
    expect(userSnap.exists).toBeTrue();
    let user = userSnap.data() as User;
    expect(user.username).toEqual(username);

    const emptyUsername = "";
    await changeCurrentUserUsername(emptyUsername);

    userSnap = await userRef.get();
    expect(userSnap.exists).toBeTrue();
    user = userSnap.data() as User;
    expect(user.username).toEqual(emptyUsername);
  });

  it("Properly changes current user username from an empty username", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "";
    const uid = await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);
    await createUserModel(uid, email, username);
    const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
    let userSnap = await userRef.get();
    expect(userSnap.exists).toBeTrue();
    let user = userSnap.data() as User;
    expect(user.username).toEqual(username);

    const newUsername = "Bob";
    await changeCurrentUserUsername(newUsername);

    userSnap = await userRef.get();
    expect(userSnap.exists).toBeTrue();
    user = userSnap.data() as User;
    expect(user.username).toEqual(newUsername);
  });

  it("Throws error when user document doesn't exist", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "";
    await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);

    const newUsername = "Bob";
    await expect(changeCurrentUserUsername(newUsername)).toReject();
  });
});
