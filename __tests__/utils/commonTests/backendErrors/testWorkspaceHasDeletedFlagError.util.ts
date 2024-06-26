import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import fetchApi from "client/utils/apiRequest/fetchApi.util";
import clientApiUrls from "common/types/clientApiUrls.type";
import { FieldValue } from "firebase-admin/firestore";
import path from "path";
import { filter, firstValueFrom } from "rxjs";
import registerAndCreateTestUserDocuments from "../../mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "../../mockUsers/signInTestUser.util";

/**
 * Tests if the provided API URL throws appropriate error message and code.
 * Creates the test user and workspace for this single test.
 * @param apiUrl API URL to test.
 * @param body Required body parameters for given API URL. Property 'workspaceId' will be
 * overwritten.
 */
export default async function testWorkspaceHasDeletedFlagError(
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
  await adminCollections.workspaces.doc(workspaceId).update({
    modificationTime: FieldValue.serverTimestamp(),
    isInBin: false,
    placingInBinTime: null,
    isDeleted: true,
  });

  const res = await fetchApi(apiUrl, {
    ...body,
    ...{
      workspaceId,
    },
  });

  expect(res.ok).toBeFalse();
  expect(res.status).toEqual(500);
  expect(await res.json()).toEqual(
    `The workspace with id ${workspaceId} has the deleted flag set, but is not in the recycle bin.`
  );
}
