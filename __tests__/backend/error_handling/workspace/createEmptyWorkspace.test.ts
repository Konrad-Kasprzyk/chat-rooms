import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserUsingApiNotFoundError from "__tests__/utils/commonTests/backendErrors/testUserUsingApiNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestEmptyWorkspace from "__tests__/utils/workspace/createTestEmptyWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import fetchApi from "client_api/utils/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";

describe("Test errors of creating an empty workspace.", () => {
  let workspaceCreatorId: string;
  const title = "test title";
  const description = "test description";
  const url = uuidv4();

  /**
   * Creates the user to create the workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
  }, BEFORE_ALL_TIMEOUT);

  it("The provided url is an empty string.", async () => {
    await signInTestUser(workspaceCreatorId);

    const res = await fetchApi(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
      url: "",
      title,
      description,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("url is not a non-empty string.");
  });

  it("The provided title is an empty string.", async () => {
    await signInTestUser(workspaceCreatorId);

    const res = await fetchApi(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
      url,
      title: "",
      description,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("title is not a non-empty string.");
  });

  it("The document of the user using the api not found.", async () => {
    await testUserUsingApiNotFoundError(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
      url,
      title,
      description,
    });
  });

  it("The user using the api has the deleted flag set.", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await adminCollections.users.doc(testUser.uid).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
      url,
      title,
      description,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(`The user with id ${testUser.uid} has the deleted flag set.`);
  });

  it("The workspace with provided url already exists.", async () => {
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestEmptyWorkspace(filename);
    await adminCollections.workspaces.doc(workspaceId).update({
      url: url,
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.createEmptyWorkspace, {
      url,
      title,
      description,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(`The workspace with url ${url} already exists.`);
  });
});
