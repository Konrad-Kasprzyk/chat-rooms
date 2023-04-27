import { adminDb } from "../../db/firebase-admin";
import COLLECTIONS from "../../global/constants/collections";
import User from "../../global/models/user.model";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../global/utils/admin_utils/emailPasswordUser";
import fetchPost from "../../global/utils/fetchPost";
import {
  requireBodyInRequest,
  requireContentTypeInRequest,
  requirePostMethod,
} from "../utils/testApiPostRequest";

const usedEmails: string[] = [];
const apiUrl = "api/create-user-model";

function getEmail() {
  const email = getUniqueEmail();
  usedEmails.push(email);
  return email;
}

describe("Test api creating user model", () => {
  afterAll(async () => await deleteRegisteredUsersAndUserDocuments(usedEmails));

  it("Requires proper POST method", async () => {
    await requirePostMethod(apiUrl);
    await requireContentTypeInRequest(apiUrl);
    await requireBodyInRequest(apiUrl);
  });

  it("Requires appropriate properties in body request to create user", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    await registerUserEmailPassword(email, password, username);
    const idToken = await signInEmailPasswordAndGetIdToken(email, password);

    const res = await fetchPost(apiUrl, { idToken, email42: email, username });

    expect(res.status).toEqual(400);
  });

  it("Properly creates user model", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const uid = await registerUserEmailPassword(email, password, username);
    const idToken = await signInEmailPasswordAndGetIdToken(email, password);

    const res = await fetchPost(apiUrl, { idToken, email, username });

    expect(res.status).toEqual(201);
    const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
    const userSnap = await userRef.get();
    expect(userSnap.exists).toBeTrue();
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
    const idToken = await signInEmailPasswordAndGetIdToken(email, password);

    let res = await fetchPost(apiUrl, { idToken, email, username });
    expect(res.status).toEqual(201);
    res = await fetchPost(apiUrl, { idToken, email, username });

    expect(res.status).toEqual(400);
    const userRef = adminDb.collection(COLLECTIONS.users).doc(uid);
    const userSnap = await userRef.get();
    expect(userSnap.exists).toBeTrue();
    const user = userSnap.data() as User;
    expect(user.id).toEqual(uid);
    expect(user.email).toEqual(email);
    expect(user.username).toEqual(username);
  });
});
