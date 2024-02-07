import fetchApi from "client/utils/apiRequest/fetchApi.util";
import type clientApiUrls from "common/types/clientApiUrls.type";
import registerTestUsers from "../../mockUsers/registerTestUsers.util";
import signInTestUser from "../../mockUsers/signInTestUser.util";

/**
 * Tests if the provided API URL throws appropriate error message and code.
 * Creates the test user for this single test.
 * @param apiUrl API URL to test.
 * @param body Required body parameters for given API URL. Property 'workspaceId' will be
 * overwritten.
 */
export default async function testUserUsingApiNotFoundError(
  apiUrl: clientApiUrls,
  body: object = {}
) {
  const registeredOnlyUser = registerTestUsers(1)[0];
  await signInTestUser(registeredOnlyUser.uid);

  const res = await fetchApi(apiUrl, {
    ...body,
    ...{
      workspaceId: "foo",
    },
  });

  expect(res.ok).toBeFalse();
  expect(res.status).toEqual(400);
  expect(await res.json()).toBeOneOf([
    `The user document with id ${registeredOnlyUser.uid} not found.`,
    `The document of user using the api with id ${registeredOnlyUser.uid} not found.`,
  ]);
}
