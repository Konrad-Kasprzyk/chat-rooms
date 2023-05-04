import { signInWithEmailAndPassword } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../db/firebase";
import { adminAuth, adminDb } from "../../db/firebase-admin";
import COLLECTIONS from "../../global/constants/collections";
import User from "../../global/models/user.model";
import fetchPost from "../../global/utils/fetchPost";
import {
  requireBodyInRequest,
  requireContentTypeInRequest,
  requirePostMethod,
} from "../utils/testApiPostRequest";

describe("Test pack", () => {
  const description = "Test api creating user document";
  const apiUrl = "api/create-user-model";
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
    await signInWithEmailAndPassword(auth, email, password);
  });
  afterAll(async () => {
    await auth.signOut();
    await adminAuth.deleteUser(uid);
  });

  describe(description, () => {
    it("Requires proper POST method", async () => {
      await requirePostMethod(apiUrl);
      await requireContentTypeInRequest(apiUrl);
      await requireBodyInRequest(apiUrl);
    });

    it("Requires appropriate properties in body request to create an user document", async () => {
      const res = await fetchPost(apiUrl, { email42: email, username });

      expect(res.status).toEqual(400);
    });

    it("Properly creates an user document", async () => {
      const res = await fetchPost(apiUrl, { email, username });

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
      const res = await fetchPost(apiUrl, { email, username });

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
