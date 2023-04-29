import { auth } from "../../db/firebase";
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

describe("Test pack", () => {
  const description = "Test api creating user document";
  const apiUrl = "api/create-user-model";
  let email = "";
  let password = "";
  const username = "Jeff";
  let idToken = "";
  let uid = "";
  beforeAll(async () => {
    email = getUniqueEmail();
    password = getRandomPassword();
    uid = await registerUserEmailPassword(email, password, username);
    idToken = await signInEmailPasswordAndGetIdToken(email, password);
  });
  afterAll(async () => {
    await auth.signOut();
    await deleteRegisteredUsersAndUserDocuments([email]);
  });

  describe(description, () => {
    it("Requires proper POST method", async () => {
      await requirePostMethod(apiUrl);
      await requireContentTypeInRequest(apiUrl);
      await requireBodyInRequest(apiUrl);
    });

    it("Requires appropriate properties in body request to create a user document", async () => {
      const res = await fetchPost(apiUrl, { idToken, email42: email, username });

      expect(res.status).toEqual(400);
    });

    it("Properly creates an user document", async () => {
      const res = await fetchPost(apiUrl, { idToken, email, username });

      expect(res.status).toEqual(201);
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
    it("Doesn't create an user model, when it already exists", async () => {
      const res = await fetchPost(apiUrl, { idToken, email, username });

      expect(res.status).toEqual(400);
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
