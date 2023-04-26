import { doc, getDoc } from "firebase/firestore";
import { changeCurrentUserUsername } from "../../../client_api/user.api";
import { db } from "../../../db/firebase";
import createUserModel from "../../../global/admin_utils/createUserModel";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../../global/admin_utils/emailPasswordUser";
import COLLECTIONS from "../../../global/constants/collections";
import User from "../../../global/models/user.model";

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
    const userRef = doc(db, COLLECTIONS.users, uid);
    let userSnap = await getDoc(userRef);
    expect(userSnap.exists()).toBeTruthy();
    let user = userSnap.data() as User;
    expect(user.username).toEqual(username);

    const newUsername = "Bob";
    await changeCurrentUserUsername(newUsername);

    userSnap = await getDoc(userRef);
    expect(userSnap.exists()).toBeTruthy();
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
    const userRef = doc(db, COLLECTIONS.users, uid);
    let userSnap = await getDoc(userRef);
    expect(userSnap.exists()).toBeTruthy();
    let user = userSnap.data() as User;
    expect(user.username).toEqual(username);

    const emptyUsername = "";
    await changeCurrentUserUsername(emptyUsername);

    userSnap = await getDoc(userRef);
    expect(userSnap.exists()).toBeTruthy();
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
    const userRef = doc(db, COLLECTIONS.users, uid);
    let userSnap = await getDoc(userRef);
    expect(userSnap.exists()).toBeTruthy();
    let user = userSnap.data() as User;
    expect(user.username).toEqual(username);

    const newUsername = "Bob";
    await changeCurrentUserUsername(newUsername);

    userSnap = await getDoc(userRef);
    expect(userSnap.exists()).toBeTruthy();
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
