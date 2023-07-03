import COLLECTIONS from "common/constants/collections";
import Workspace from "common/models/workspace.model";
import ApiError from "common/types/apiError";
import Collections from "common/types/collections";
import { adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function removeUsersFromWorkspace(
  userIds: string[],
  workspaceId: string,
  testCollections: Collections = COLLECTIONS
) {
  const workspaceRef = adminDb.collection(testCollections.workspaces).doc(workspaceId);
  const workspaceSnap = await workspaceRef.get();
  if (!workspaceSnap.exists)
    throw new ApiError(400, `Couldn't find a workspace with id ${workspaceId}`);
  const workspace = workspaceSnap.data() as Workspace;
  const promises = [];
  const userIdsToRemove = userIds.filter((uid) => workspace.userIds.includes(uid));
  if (userIdsToRemove.length > 0) {
    for (const userId of userIdsToRemove)
      promises.push(
        adminDb
          .collection(testCollections.users)
          .doc(userId)
          .update({
            workspaces: FieldValue.arrayRemove({
              id: workspaceId,
              url: workspace.url,
              title: workspace.title,
              description: workspace.description,
            }),
            workspaceIds: FieldValue.arrayRemove(workspaceId),
          })
      );
    promises.push(
      adminDb
        .collection(testCollections.workspaces)
        .doc(workspaceId)
        .update({ userIds: FieldValue.arrayRemove(...userIdsToRemove) })
    );
  }
  return Promise.all(promises);
}
