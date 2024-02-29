import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import clientApiUrls from "common/types/clientApiUrls.type";
import path from "path";
import { filter, firstValueFrom } from "rxjs";
import registerAndCreateTestUserDocuments from "../../../mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "../../../mockUsers/signInTestUser.util";

/**
 * Tests if the provided API URL throws appropriate history not found error message and code.
 * Creates the test user and workspace for this single test.
 * @param apiUrl API URL to test.
 * @param body Required body parameters for given API URL. Property 'workspaceId' will be
 * overwritten.
 */
export default async function testColumnsHistoryNotFoundError(
  apiUrl: clientApiUrls,
  body: object = {}
) {
  const testUser = (await registerAndCreateTestUserDocuments(1))[0];
  await signInTestUser(testUser.uid);
  await firstValueFrom(
    listenCurrentUserDetails().pipe(filter((userDetails) => userDetails?.id == testUser.uid))
  );
  const filename = path.parse(__filename).name;
  const workspaceId = await createTestWorkspace(filename);
  const workspace = (await adminCollections.workspaces.doc(workspaceId).get()).data();
  await adminCollections.columnHistories.doc(workspace!.newestColumnsHistoryId).delete();

  const res = await fetchApi(apiUrl, {
    ...body,
    ...{
      workspaceId,
    },
  });

  expect(res.ok).toBeFalse();
  expect(res.status).toEqual(500);
  expect(await res.json()).toEqual(
    `Found the workspace document, but couldn't find the columns history document ` +
      `with id ${workspace!.newestColumnsHistoryId}`
  );
}
