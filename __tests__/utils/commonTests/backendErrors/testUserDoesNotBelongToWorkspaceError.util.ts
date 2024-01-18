import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client_api/user/listenCurrentUserDetails.api";
import fetchApi from "client_api/utils/fetchApi.util";
import createEmptyWorkspace from "client_api/workspace/createEmptyWorkspace.api";
import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import clientApiUrls from "common/types/clientApiUrls.type";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import registerAndCreateTestUserDocuments from "../../mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "../../mockUsers/signInTestUser.util";

/**
 * Tests if the provided API URL throws appropriate error message and code.
 * Creates the test user and workspace for this single test.
 * @param apiUrl API URL to test.
 * @param body Required body parameters for given API URL. Property 'workspaceId' will be
 * overwritten.
 */
export default async function testUserDoesNotBelongToWorkspaceError(
  apiUrl: clientApiUrls,
  body: object = {}
) {
  const testUser = (await registerAndCreateTestUserDocuments(1))[0];
  await signInTestUser(testUser.uid);
  await firstValueFrom(
    listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
  );
  const workspaceUrl = uuidv4();
  const filename = path.parse(__filename).name;
  const workspaceTitle = "Test title from file: " + filename;
  const workspaceDescription = "Test description from file: " + filename;
  const workspaceId = await createEmptyWorkspace(
    workspaceUrl,
    workspaceTitle,
    workspaceDescription
  );
  //TODO when implemented change this to one client function "Leave workspace"
  const userPromise = adminCollections.users.doc(testUser.uid).update({
    workspaceIds: adminArrayRemove<User, "workspaceIds">(workspaceId),
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  const workspacePromise = adminCollections.workspaces.doc(workspaceId).update({
    userIds: adminArrayRemove<Workspace, "userIds">(testUser.uid),
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  const workspaceSummaryPromise = adminCollections.workspaceSummaries.doc(workspaceId).update({
    userIds: adminArrayRemove<Workspace, "userIds">(testUser.uid),
    modificationTime: FieldValue.serverTimestamp() as Timestamp,
  });
  await Promise.all([userPromise, workspacePromise, workspaceSummaryPromise]);

  const res = await fetchApi(apiUrl, {
    ...body,
    ...{
      workspaceId,
    },
  });

  expect(res.ok).toBeFalse();
  expect(res.status).toEqual(400);
  expect(await res.json()).toEqual(
    `The user with id ${testUser.uid} doesn't belong to the workspace with id ${workspaceId}`
  );
}
