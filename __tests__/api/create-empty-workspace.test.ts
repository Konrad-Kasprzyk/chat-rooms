import path from "path";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../db/firebase";
import { adminDb } from "../../db/firebase-admin";
import COLLECTIONS from "../../global/constants/collections";
import TestUsersAndSubcollections from "../../global/models/utils_models/testUsersAndSubcollections.model";
import fetchPost from "../../global/utils/fetchPost";
import getTestUsers, { signInTestUser } from "../../global/utils/test_utils/testUsers";
import {
  requireBodyInRequest,
  requireContentTypeInRequest,
  requirePostMethod,
} from "../utils/testApiPostRequest";
import testEmptyWorkspace from "../utils/testEmptyWorkspace";

describe("Test api creating an empty workspace", () => {
  const apiUrl = "api/create-empty-workspace";
  let uid = "";
  const workspaceTitle = "First project";
  const filename = path.parse(__filename).name;
  const workspaceDescription = filename;
  let testUsers: TestUsersAndSubcollections;
  beforeAll(async () => {
    testUsers = await getTestUsers();
    const testUser = await signInTestUser(testUsers);
    uid = testUser.uid;
  });
  afterAll(async () => {
    await auth.signOut();
  });

  it("Requires proper POST method", async () => {
    await requirePostMethod(apiUrl);
    await requireContentTypeInRequest(apiUrl);
    await requireBodyInRequest(apiUrl);
  });

  it("Requires appropriate properties in body request to create an empty workspace", async () => {
    const workspaceUrl = uuidv4();

    const res = await fetchPost(apiUrl, {
      url42: workspaceUrl,
      title: workspaceTitle,
      description: workspaceDescription,
    });

    expect(res.status).toEqual(400);
  });

  it("Properly creates an empty workspace", async () => {
    const workspaceUrl = uuidv4();

    const res = await fetchPost(apiUrl, {
      url: workspaceUrl,
      title: workspaceTitle,
      description: workspaceDescription,
    });

    expect(res.status).toEqual(201);
    const workspaceId = await res.text();
    await testEmptyWorkspace(uid, workspaceId, workspaceUrl, workspaceTitle, workspaceDescription);
  });

  it("Doesn't create an empty workspace, when workspace url is already taken.", async () => {
    const workspaceUrl = uuidv4();

    let res = await fetchPost(apiUrl, {
      url: workspaceUrl,
      title: workspaceTitle,
      description: workspaceDescription,
    });
    expect(res.status).toEqual(201);
    const workspaceId = await res.text();
    expect(workspaceId).toBeString();
    res = await fetchPost(apiUrl, {
      url: workspaceUrl,
      title: workspaceTitle,
      description: workspaceDescription,
    });

    expect(res.status).toEqual(400);
    const error = await res.text();
    expect(error).toBeString();
    const workspacesSnap = await adminDb
      .collection(COLLECTIONS.workspaces)
      .where("url", "==", workspaceUrl)
      .get();
    expect(workspacesSnap.size).toEqual(1);
  });
});
