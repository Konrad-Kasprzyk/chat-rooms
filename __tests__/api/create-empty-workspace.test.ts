import path from "path";
import { auth } from "../../db/firebase";
import { adminDb } from "../../db/firebase-admin";
import COLLECTIONS from "../../global/constants/collections";
import createUserModel from "../../global/utils/admin_utils/createUserModel";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
  signInEmailPasswordAndGetIdToken,
} from "../../global/utils/admin_utils/emailPasswordUser";
import {
  deleteWorkspaceAndRelatedDocuments,
  getRandomUrl,
} from "../../global/utils/admin_utils/workspace";
import fetchPost from "../../global/utils/fetchPost";
import {
  requireBodyInRequest,
  requireContentTypeInRequest,
  requirePostMethod,
} from "../utils/testApiPostRequest";
import testEmptyWorkspace from "../utils/testEmptyWorkspace";

const usedWorkspaceUrls: string[] = [];
const apiUrl = "api/create-empty-workspace";

describe("Test api creating an empty workspace", () => {
  const email = getUniqueEmail();
  const password = getRandomPassword();
  const filename = path.parse(__filename).name;
  const username = "Jeff " + filename;
  let idToken = "";
  let uid = "";
  const workspaceTitle = "First project";
  const workspaceDescription = filename;
  beforeAll(async () => {
    uid = await registerUserEmailPassword(email, password, username);
    idToken = await signInEmailPasswordAndGetIdToken(email, password);
    await createUserModel(uid, email, username);
  });
  afterAll(async () => {
    await auth.signOut();
    const promises: Promise<any>[] = [];
    promises.push(deleteRegisteredUsersAndUserDocuments([email]));
    for (const workspaceUrl of usedWorkspaceUrls)
      promises.push(deleteWorkspaceAndRelatedDocuments(workspaceUrl));
    await Promise.all(promises);
  });

  it("Requires proper POST method", async () => {
    await requirePostMethod(apiUrl);
    await requireContentTypeInRequest(apiUrl);
    await requireBodyInRequest(apiUrl);
  });

  it("Requires appropriate properties in body request to create an empty workspace", async () => {
    const workspaceUrl = getRandomUrl();
    usedWorkspaceUrls.push(workspaceUrl);

    const res = await fetchPost(apiUrl, {
      idToken,
      url42: workspaceUrl,
      title: workspaceTitle,
      description: workspaceDescription,
    });

    expect(res.status).toEqual(400);
  });

  it("Properly creates an empty workspace", async () => {
    const workspaceUrl = getRandomUrl();
    usedWorkspaceUrls.push(workspaceUrl);

    const res = await fetchPost(apiUrl, {
      idToken,
      url: workspaceUrl,
      title: workspaceTitle,
      description: workspaceDescription,
    });

    expect(res.status).toEqual(201);
    const workspaceId = await res.text();
    await testEmptyWorkspace(uid, workspaceId, workspaceUrl, workspaceTitle, workspaceDescription);
  });

  it("Doesn't create an empty workspace, when workspace url is already taken.", async () => {
    const workspaceUrl = getRandomUrl();
    usedWorkspaceUrls.push(workspaceUrl);

    let res = await fetchPost(apiUrl, {
      idToken,
      url: workspaceUrl,
      title: workspaceTitle,
      description: workspaceDescription,
    });
    expect(res.status).toEqual(201);
    const workspaceId = await res.text();
    expect(workspaceId).toBeString();
    res = await fetchPost(apiUrl, {
      idToken,
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
