import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import fetchTestApi from "common/test_utils/fetchTestApi.util";
import ApiError from "common/types/apiError.class";
import registerTestUsers from "./registerTestUsers.util";

/**
 * Registers new mocked users and creates their documents.
 * @returns an array of new users data from registration.
 */
export default async function registerAndCreateTestUserDocuments(howMany: number): Promise<
  {
    uid: string;
    email: string;
    displayName: string;
  }[]
> {
  const registeredTestUsers = registerTestUsers(howMany);
  for (const user of registeredTestUsers) {
    const res = await fetchTestApi(CLIENT_API_URLS.user.createUserDocument, {
      uid: user.uid,
      email: user.email,
      username: user.displayName,
    });
    if (!res.ok) throw new ApiError(res.status, await res.text());
  }
  return registeredTestUsers;
}
