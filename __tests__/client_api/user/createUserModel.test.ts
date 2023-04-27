import { exportedForTesting } from "../../../client_api/user.api";
import { adminDb } from "../../../db/firebase-admin";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../../global/utils/admin_utils/emailPasswordUser";
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

    const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
    const userSnap = await userRef.get();
    expect(userSnap.exists).toBeFalse();
  });

  it("Properly creates user model", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const uid = await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);

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

  it("Doesn't create user model, when it already exists", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const uid = await registerUserEmailPassword(email, password, username);
    await signInEmailPasswordAndGetIdToken(email, password);

    await createUserModel!(email, username);
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
