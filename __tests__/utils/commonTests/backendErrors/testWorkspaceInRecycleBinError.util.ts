import adminCollections from "backend/db/adminCollections.firebase";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import fetchApi from "clientApi/utils/apiRequest/fetchApi.util";
import createWorkspace from "clientApi/workspace/createWorkspace.api";
import clientApiUrls from "common/types/clientApiUrls.type";
import { FieldValue } from "firebase-admin/firestore";
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
export default async function testWorkspaceInRecycleBinError(
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
  const workspaceId = await createWorkspace(workspaceUrl, workspaceTitle, workspaceDescription);
  await adminCollections.workspaces.doc(workspaceId).update({
    modificationTime: FieldValue.serverTimestamp(),
    isInBin: true,
    placingInBinTime: FieldValue.serverTimestamp(),
  });

  const res = await fetchApi(apiUrl, {
    ...body,
    ...{
      workspaceId,
    },
  });

  expect(res.ok).toBeFalse();
  expect(res.status).toEqual(400);
  expect(await res.json()).toEqual(`The workspace with id ${workspaceId} is in the recycle bin.`);
}
