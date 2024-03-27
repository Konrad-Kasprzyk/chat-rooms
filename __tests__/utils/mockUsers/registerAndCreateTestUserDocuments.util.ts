import fetchTestApi from "__tests__/utils/apiRequest/fetchTestApi.util";
import handleApiResponse from "client/utils/apiRequest/handleApiResponse.util";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import registerTestUsers from "./registerTestUsers.util";

/**
 * Registers new mocked users and creates their documents.
 * @returns an array of new users data from registration.
 */
export default async function registerAndCreateTestUserDocuments<
  IsAnonymousUser extends boolean = false
>(
  howMany: number,
  anonymousUser?: IsAnonymousUser
): Promise<
  IsAnonymousUser extends true
    ? {
        uid: string;
        email: null;
        displayName: string;
        emailVerified: false;
      }[]
    : {
        uid: string;
        email: string;
        displayName: string;
        emailVerified: true;
      }[]
> {
  const registeredTestUsers = registerTestUsers(howMany, anonymousUser);
  for (const user of registeredTestUsers) {
    const res = await fetchTestApi(CLIENT_API_URLS.user.createUserDocuments, {
      uid: user.uid,
      email: user.email,
      username: user.displayName,
    });
    await handleApiResponse(res);
  }
  return registeredTestUsers;
}
