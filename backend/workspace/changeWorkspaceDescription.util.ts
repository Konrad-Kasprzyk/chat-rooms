import COLLECTIONS from "common/constants/collections.constant";
import Workspace from "common/models/workspace.model";
import ApiError from "common/types/apiError.class";
import Collections from "common/types/collections.type";
import { adminDb } from "db/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export default function changeWorkspaceDescription(
  uid: string,
  workspaceId: string,
  newDescription: string,
  collections: Collections = COLLECTIONS
) {
  const workspaceRef = adminDb.collection(collections.workspaces).doc(workspaceId);
  return adminDb.runTransaction(async (transaction) => {
    const workspaceSnap = await transaction.get(workspaceRef);
    if (!workspaceSnap.exists)
      throw new ApiError(400, `Workspace with id ${workspaceId} not found.`);
    const workspace = workspaceSnap.data() as Workspace;
    if (!workspace.userIds.some((id) => id === uid))
      throw new ApiError(400, `Signed in user doesn't belong to workspace with id ${workspaceId}`);
    const belongingUserRefs = workspace.userIds.map((id) =>
      adminDb.collection(collections.users).doc(id)
    );
    const invitedUserRefs = workspace.invitedUserIds.map((id) =>
      adminDb.collection(collections.users).doc(id)
    );
    const belongingUsersSnap =
      belongingUserRefs.length > 0 ? await transaction.getAll(...belongingUserRefs) : [];
    const invitedUsersSnap =
      invitedUserRefs.length > 0 ? await transaction.getAll(...invitedUserRefs) : [];
    for (const userSnap of belongingUsersSnap) {
      transaction.update(userSnap.ref, {
        workspaces: FieldValue.arrayRemove({
          id: workspace.id,
          url: workspace.url,
          title: workspace.title,
          description: workspace.description,
        }),
      });
      transaction.update(userSnap.ref, {
        workspaces: FieldValue.arrayUnion({
          id: workspace.id,
          url: workspace.url,
          title: workspace.title,
          description: newDescription,
        }),
      });
    }
    for (const userSnap of invitedUsersSnap) {
      transaction.update(userSnap.ref, {
        workspaceInvitations: FieldValue.arrayRemove({
          id: workspace.id,
          url: workspace.url,
          title: workspace.title,
          description: workspace.description,
        }),
      });
      transaction.update(userSnap.ref, {
        workspaceInvitations: FieldValue.arrayUnion({
          id: workspace.id,
          url: workspace.url,
          title: workspace.title,
          description: newDescription,
        }),
      });
    }
    transaction.update(workspaceRef, { description: newDescription });
  });
}
