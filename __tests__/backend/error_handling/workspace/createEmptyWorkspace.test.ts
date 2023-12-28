import BEFORE_ALL_TIMEOUT from "__tests__/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import fetchApi from "client_api/utils/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import auth from "common/db/auth.firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";

describe("Test errors of creating an empty workspace.", () => {
  const title = "test title";
  const description = "test description";
  const url = uuidv4();
  let userId: string;

  /**
   * Creates and signs in the test user.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    userId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(userId);
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Signs in the test user.
   */
  beforeEach(async () => {
    if (!auth.currentUser || auth.currentUser.uid !== userId) await signInTestUser(userId);
    await firstValueFrom(listenCurrentUser().pipe(filter((user) => user?.id == userId)));
  });

  it("The provided url is an empty string.", async () => {
    const res = await fetchApi(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
      url: "",
      title,
      description,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual("url is not a non-empty string.");
  });

  it("The provided title is an empty string.", async () => {
    const res = await fetchApi(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
      url,
      title: "",
      description,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual("title is not a non-empty string.");
  });

  it("The document of user using the api not found.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    const res = await fetchApi(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
      url,
      title,
      description,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user document with id ${registeredOnlyUser.uid} not found.`
    );
  });

  it("The user using the api has the deleted flag set.", async () => {
    await adminCollections.users.doc(userId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
      url,
      title,
      description,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(`The user with id ${userId} has the deleted flag set.`);
    await adminCollections.users.doc(userId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });
  });

  it("The workspace with provided url already exists.", async () => {
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestEmptyWorkspace(filename);
    await adminCollections.workspaces.doc(workspaceId).update({
      url: url,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
      url,
      title,
      description,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(`Workspace with url ${url} already exists.`);
    await adminCollections.workspaces.doc(workspaceId).update({
      url: uuidv4(),
    });
  });
});
