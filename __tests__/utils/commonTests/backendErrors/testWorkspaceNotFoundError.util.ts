import fetchApi from "client_api/utils/fetchApi.util";
import clientApiUrls from "common/types/clientApiUrls.type";
import registerAndCreateTestUserDocuments from "../../mockUsers/registerAndCreateTestUserDocuments.util";
import signInTestUser from "../../mockUsers/signInTestUser.util";

/**
 * Tests if the provided API URL throws appropriate error message and code.
 * Creates the test user for this single test.
 * @param apiUrl API URL to test.
 * @param body Required body parameters for given API URL. Property 'workspaceId' will be
 * overwritten.
 */
export default async function testWorkspaceNotFoundError(apiUrl: clientApiUrls, body: object = {}) {
  const testUser = (await registerAndCreateTestUserDocuments(1))[0];
  await signInTestUser(testUser.uid);

  const res = await fetchApi(apiUrl, {
    ...body,
    ...{
      workspaceId: "foo",
    },
  });

  expect(res.ok).toBeFalse();
  expect(res.status).toEqual(400);
  expect(await res.json()).toEqual("The workspace document with id foo not found.");
}
