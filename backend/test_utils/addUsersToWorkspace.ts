import COLLECTIONS from "common/constants/collections";
import Workspace from "common/models/workspace.model";
import ApiError from "common/types/apiError";
import Collections from "common/types/collections";
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
  const promises = [];
  const userIdsToAdd = userIds.filter((uid) => !workspace.userIds.includes(uid));
  if (userIdsToAdd.length > 0) {
    for (const userId of userIdsToAdd)
      promises.push(
        adminDb
          .collection(testCollections.users)
          .doc(userId)
          .update({
            workspaces: FieldValue.arrayUnion({
              id: workspaceId,
              url: workspace.url,
              title: workspace.title,
              description: workspace.description,
            }),
            workspaceIds: FieldValue.arrayUnion(workspaceId),
          })
      );
    promises.push(
      adminDb
        .collection(testCollections.workspaces)
        .doc(workspaceId)
        .update({ userIds: FieldValue.arrayUnion(...userIdsToAdd) })
    );
  }
  return Promise.all(promises);
}
