import { adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import COLLECTIONS from "global/constants/collections";

export function addUsersToWorkspace(
  userIds: string[],
  workspaceId: string,
  workspaceTitle: string,
  workspaceDescription: string
) {
  const promises = [];
  for (const userId of userIds)
    promises.push(
      adminDb
        .collection(COLLECTIONS.users)
        .doc(userId)
        .update({
          workspaces: FieldValue.arrayUnion({
            id: workspaceId,
            title: workspaceTitle,
            description: workspaceDescription,
          }),
          workspaceIds: FieldValue.arrayUnion(workspaceId),
        })
    );
  promises.push(
    adminDb
      .collection(COLLECTIONS.workspaces)
      .doc(workspaceId)
      .update({ userIds: FieldValue.arrayUnion(...userIds) })
  );
  return Promise.all(promises);
}

export function removeUsersFromWorkspace(
  userIds: string[],
  workspaceId: string,
  workspaceTitle: string,
  workspaceDescription: string
) {
  const promises = [];
  for (const userId of userIds)
    promises.push(
      adminDb
        .collection(COLLECTIONS.users)
        .doc(userId)
        .update({
          workspaces: FieldValue.arrayRemove({
            id: workspaceId,
            title: workspaceTitle,
            description: workspaceDescription,
          }),
          workspaceIds: FieldValue.arrayRemove(workspaceId),
        })
    );
  promises.push(
    adminDb
      .collection(COLLECTIONS.workspaces)
      .doc(workspaceId)
      .update({ userIds: FieldValue.arrayRemove(...userIds) })
  );
  return Promise.all(promises);
}
