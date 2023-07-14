import API_URLS from "common/constants/apiUrls";
import User from "common/models/user.model";
import fetchTestApi from "common/test_utils/fetchTestApi";
import testCollectionsId from "../setup/testCollectionsId";
import registerTestUsers from "./registerTestUsers";

export default async function registerAndCreateTestUserDocuments(howMany: number): Promise<User[]> {
  const registeredTestUsers = registerTestUsers(howMany);
  const createdUserModels: { id: string; email: string; username: string }[] = [];
  for (const user of registeredTestUsers) {
    const res = await fetchTestApi(API_URLS.user.createUserModel, {
      uid: user.uid,
      email: user.email,
      username: user.displayName,
      testCollectionsId,
    });
    if (!res.ok) throw await res.text();
    createdUserModels.push({ id: user.uid, email: user.email, username: user.displayName });
  }
  return createdUserModels.map((user) => ({
    shortId: user.id,
    workspaces: [],
    workspaceIds: [],
    workspaceInvitations: [],
    workspaceInvitationIds: [],
    ...user,
  }));
}
