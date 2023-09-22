import { getOpenWorkspaceId } from "client_api/workspace/openWorkspaceId.utils";
import collections from "common/db/collections.firebase";
import User from "common/models/user.model";
import { Timestamp, getDocs } from "firebase/firestore";

export default async function _getWorkspaceUsersFromFirestore(
  modifiedAfter?: Timestamp
): Promise<User[]> {
  const openWorkspaceId = getOpenWorkspaceId();
  if (!openWorkspaceId) return [];
  let query = collections.users
    .where("workspaceIds", "array-contains", openWorkspaceId)
    .orderBy("username");
  if (modifiedAfter) query = query.where("modificationTime", ">=", modifiedAfter);
  const docSnaps = await getDocs(query);
  const users = docSnaps.docs.map((doc) => doc.data());
  //TODO save docs into indexedDB
  return users;
}
