import BEFORE_ALL_TIMEOUT from "__tests__/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import createTestEmptyWorkspace from "__tests__/utils/createTestEmptyWorkspace.util";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import registerTestUsers from "__tests__/utils/mockUsers/registerTestUsers.util";
import signInTestUser from "__tests__/utils/mockUsers/signInTestUser.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUser from "client_api/user/listenCurrentUser.api";
import fetchApi from "client_api/utils/fetchApi.util";
import listenOpenWorkspace from "client_api/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import auth from "common/db/auth.firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";

describe("Test errors of changing the workspace description.", () => {
  const newDescription = "new description";
  let workspaceCreatorId: string;
  let workspaceId: string;

  /**
   * Creates and opens the test workspace.
   */
  beforeAll(async () => {
    await globalBeforeAll();
    workspaceCreatorId = (await registerAndCreateTestUserDocuments(1))[0].uid;
    await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == workspaceCreatorId))
    );
    const filename = path.parse(__filename).name;
    workspaceId = await createTestEmptyWorkspace(filename);
    setOpenWorkspaceId(workspaceId);
    await firstValueFrom(
      listenOpenWorkspace().pipe(filter((workspace) => workspace?.id == workspaceId))
    );
  }, BEFORE_ALL_TIMEOUT);

  /**
   * Signs in the workspace creator
   */
  beforeEach(async () => {
    if (!auth.currentUser || auth.currentUser.uid !== workspaceCreatorId)
      await signInTestUser(workspaceCreatorId);
    await firstValueFrom(
      listenCurrentUser().pipe(filter((user) => user?.id == workspaceCreatorId))
    );
  });

  it("The document of user using the api not found.", async () => {
    const registeredOnlyUser = registerTestUsers(1)[0];
    await signInTestUser(registeredOnlyUser.uid);

    const res = await fetchApi(CLIENT_API_URLS.workspace.changeWorkspaceDescription, {
      workspaceId,
      newDescription,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user document with id ${registeredOnlyUser.uid} not found.`
    );
  });

  it("The user using the api has the deleted flag set.", async () => {
    await adminCollections.users.doc(workspaceCreatorId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: true,
      deletionTime: FieldValue.serverTimestamp() as Timestamp,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.changeWorkspaceDescription, {
      workspaceId,
      newDescription,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user with id ${workspaceCreatorId} has the deleted flag set.`
    );
    await adminCollections.users.doc(workspaceCreatorId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isDeleted: false,
      deletionTime: null,
    });
  });

  it("The workspace document not found.", async () => {
    const res = await fetchApi(CLIENT_API_URLS.workspace.changeWorkspaceDescription, {
      workspaceId: "foo",
      newDescription,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(`Couldn't find the workspace with id foo`);
  });

  it("The workspace is in the recycle bin.", async () => {
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp() as Timestamp,
      insertedIntoBinByUserId: workspaceCreatorId,
    });

    const res = await fetchApi(CLIENT_API_URLS.workspace.changeWorkspaceDescription, {
      workspaceId,
      newDescription,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(`The workspace with id ${workspaceId} is in the recycle bin.`);
    await adminCollections.workspaces.doc(workspaceId).update({
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: false,
      placingInBinTime: null,
      insertedIntoBinByUserId: null,
    });
  });

  it("The user using the api does not belong to the workspace.", async () => {
    const newUser = (await registerAndCreateTestUserDocuments(1))[0];
    await signInTestUser(newUser.uid);

    const res = await fetchApi(CLIENT_API_URLS.workspace.changeWorkspaceDescription, {
      workspaceId,
      newDescription,
    });

    expect(res.ok).toBeFalse();
    expect(await res.text()).toEqual(
      `The user with id ${newUser.uid} doesn't belong to the workspace with id ${workspaceId}`
    );
  });
});
