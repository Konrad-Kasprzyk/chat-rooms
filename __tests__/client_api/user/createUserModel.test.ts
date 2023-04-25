import { doc, getDoc } from "firebase/firestore";
import { exportedForTesting } from "../../../client_api/user.api";
import { db } from "../../../db/firebase";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../../global/admin_utils/emailPasswordUser";
import COLLECTIONS from "../../../global/constants/collections";
import User from "../../../global/models/user.model";

const { createUserModel } = exportedForTesting;
const usedEmails: string[] = [];

function getEmail() {
  const email = getUniqueEmail();
  usedEmails.push(email);
  return email;
}

describe("Test client api creating user model", () => {
  beforeAll(() => {
    if (!createUserModel) throw "Imported function createUserModel is undefined.";
  });

  afterAll(async () => await deleteRegisteredUsersAndUserDocuments(usedEmails));

  it("Throws error when user is not logged in", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const uid = await registerUserEmailPassword(email, password, username);

    await expect(createUserModel!(email, username)).toReject();

    const userRef = doc(db, COLLECTIONS.users, uid);
    const userSnap = await getDoc(userRef);
    expect(userSnap.exists()).toBeFalse();
  });

  it("Properly creates user model", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const uid = await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);

    await createUserModel!(email, username);

    const userRef = doc(db, COLLECTIONS.users, uid);
    const userSnap = await getDoc(userRef);
    expect(userSnap.exists()).toBeTruthy();
    const user = userSnap.data() as User;
    expect(user.id).toEqual(uid);
    expect(user.email).toEqual(email);
    expect(user.username).toEqual(username);
  });

  it("Doesn't create user model, when it already exists", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const uid = await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);

    await createUserModel!(email, username);
    await expect(createUserModel!(email, username)).toReject();

    const userRef = doc(db, COLLECTIONS.users, uid);
    const userSnap = await getDoc(userRef);
    expect(userSnap.exists()).toBeTruthy();
    const user = userSnap.data() as User;
    expect(user.id).toEqual(uid);
    expect(user.email).toEqual(email);
    expect(user.username).toEqual(username);
  });
});
