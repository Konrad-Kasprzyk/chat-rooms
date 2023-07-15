import COLLECTIONS from "common/constants/collections.constant";
import User from "common/models/user.model";
import Workspace from "common/models/workspace.model";
import ApiError from "common/types/apiError.class";
import Collections from "common/types/collections.type";
import { adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function addUsersToWorkspace(
  userIds: string[],
  workspaceId: string,
  testCollections: Collections = COLLECTIONS
) {
  const workspaceRef = adminDb.collection(testCollections.workspaces).doc(workspaceId);
  const workspaceSnap = await workspaceRef.get();
  if (!workspaceSnap.exists)
    throw new ApiError(400, `Couldn't find a workspace with id ${workspaceId}`);
  const workspace = workspaceSnap.data() as Workspace;
  const userIdsToAdd = userIds.filter((uid) => !workspace.userIds.includes(uid));
  const batch = adminDb.batch();
  if (userIdsToAdd.length > 0) {
    for (const userId of userIdsToAdd) {
      batch.update(adminDb.collection(testCollections.users).doc(userId), {
        workspaces: FieldValue.arrayUnion({
          id: workspaceId,
          url: workspace.url,
          title: workspace.title,
          description: workspace.description,
        } satisfies User["workspaces"][number]),
        workspaceIds: FieldValue.arrayUnion(workspaceId satisfies User["workspaceIds"][number]),
      });
    }
    batch.update(adminDb.collection(testCollections.workspaces).doc(workspaceId), {
      userIds: FieldValue.arrayUnion(...(userIdsToAdd satisfies Workspace["userIds"])),
    });
  }
  return batch.commit();
}
