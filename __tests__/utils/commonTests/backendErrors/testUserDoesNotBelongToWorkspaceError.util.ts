import createTestWorkspace from "__tests__/utils/workspace/createTestWorkspace.util";
import listenCurrentUser from "clientApi/user/listenCurrentUser.api";
import listenCurrentUserDetails from "clientApi/user/listenCurrentUserDetails.api";
import fetchApi from "clientApi/utils/apiRequest/fetchApi.util";
import leaveWorkspace from "clientApi/workspace/leaveWorkspace.api";
import clientApiUrls from "common/types/clientApiUrls.type";
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
export default async function testUserDoesNotBelongToWorkspaceError(
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
  await firstValueFrom(
    listenCurrentUser().pipe(
      filter((user) => user?.id == testUser.uid && user.workspaceIds.length == 1)
    )
  );
  await leaveWorkspace(workspaceId);

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
