import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testUserUsingApiNotFoundError from "__tests__/utils/commonTests/backendErrors/testUserUsingApiNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of creating a workspace.", () => {
  let workspaceCreatorId: string;
  const title = "test title";
  const description = "test description";
  const url = "";

  /**
   * Creates the user to create the workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
  }, BEFORE_ALL_TIMEOUT);

  it("The provided title is an empty string.", async () => {
    await signInTestUser(workspaceCreatorId);

    const res = await fetchApi(CLIENT_API_URLS.workspace.createWorkspace, {
      title: "",
      description,
      url,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("title is not a non-empty string.");
  });

  it("The description is not provided.", async () => {
    await signInTestUser(workspaceCreatorId);

    const res = await fetchApi(CLIENT_API_URLS.workspace.createWorkspace, {
      title,
      url,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("description not found in POST body.");
  });

  it("The URL is not provided.", async () => {
    await signInTestUser(workspaceCreatorId);

    const res = await fetchApi(CLIENT_API_URLS.workspace.createWorkspace, {
      title,
      description,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("url not found in POST body.");
  });

  it("The document of the user using the api not found.", async () => {
    await testUserUsingApiNotFoundError(CLIENT_API_URLS.workspace.createWorkspace, {
      title,
      description,
      url,
    });
  });

  it("Found the user document, but the user details document is not found.", async () => {
    const testUserId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(testUserId);
    await adminCollections.userDetails.doc(testUserId).delete();

    const res = await fetchApi(CLIENT_API_URLS.workspace.createWorkspace, {
      title,
      description,
      url,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      `Found the user document, but the user details document with id ${testUserId} is not found.`
    );
  });

  it("The workspace with provided url already exists.", async () => {
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(
        filter((userDetails) => userDetails?.id == workspaceCreatorId)
      )
    );
    const filename = path.parse(__filename).name;
    const workspaceId = await createTestWorkspace(filename);
    const workspaceDTO = (await adminCollections.workspaces.doc(workspaceId).get()).data()!;

    const res = await fetchApi(CLIENT_API_URLS.workspace.createWorkspace, {
      title,
      description,
      url: workspaceDTO.url,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(`The workspace with url ${workspaceDTO.url} already exists.`);
  });
});
