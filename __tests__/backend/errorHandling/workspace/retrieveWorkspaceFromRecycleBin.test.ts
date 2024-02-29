import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import testWorkspaceHistoryNotFoundError from "__tests__/utils/commonTests/backendErrors/historyNotFound/testWorkspaceHistoryNotFoundError.util";
import testUserHasDeletedFlagError from "__tests__/utils/commonTests/backendErrors/testUserHasDeletedFlagError.util";
import testUserUsingApiNotFoundError from "__tests__/utils/commonTests/backendErrors/testUserUsingApiNotFoundError.util";
import testWorkspaceNotFoundError from "__tests__/utils/commonTests/backendErrors/testWorkspaceNotFoundError.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import { removeUsersFromWorkspace } from "__tests__/utils/workspace/removeUsersFromWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import { FieldValue } from "firebase-admin/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of retrieving a workspace from the recycle bin.", () => {
  const filename = path.parse(__filename).name;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("The document of the user using the api not found.", async () => {
    await testUserUsingApiNotFoundError(CLIENT_API_URLS.workspace.retrieveWorkspaceFromRecycleBin);
  });

  it("The workspace document not found.", async () => {
    await testWorkspaceNotFoundError(CLIENT_API_URLS.workspace.retrieveWorkspaceFromRecycleBin);
  });

  it("The workspace history document not found.", async () => {
    await testWorkspaceHistoryNotFoundError(
      CLIENT_API_URLS.workspace.retrieveWorkspaceFromRecycleBin
    );
  });

  it("The user using the api has the deleted flag set.", async () => {
    await testUserHasDeletedFlagError(CLIENT_API_URLS.workspace.retrieveWorkspaceFromRecycleBin);
  });

  it("The workspace has the deleted flag set.", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    const workspaceId = await createTestWorkspace(filename);
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp(),
      isDeleted: true,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.retrieveWorkspaceFromRecycleBin, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} has the deleted flag set.`
    );
  });

  it("The workspace is not in the recycle bin.", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    const workspaceId = await createTestWorkspace(filename);

    const res = await fetchApi(CLIENT_API_URLS.workspace.retrieveWorkspaceFromRecycleBin, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The workspace with id ${workspaceId} is not in the recycle bin.`
    );
  });

  it("The user does not belong to the workspace.", async () => {
    const testUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(testUser.uid);
    await firstValueFrom(
      listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
    );
    const workspaceId = await createTestWorkspace(filename);
    await removeUsersFromWorkspace(workspaceId, [testUser.uid]);
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp(),
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp(),
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.retrieveWorkspaceFromRecycleBin, {
      workspaceId,
    });

    expect(res.ok).toBeFalse();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      `The user with id ${testUser.uid} doesn't belong to the workspace with id ${workspaceId}`
    );
  });
});
