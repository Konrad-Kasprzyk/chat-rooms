import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import User from "common/models/user.model";
import UserDetails from "common/models/userDetails.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Marks the workspace as put in the recycle bin if it is not already there.
 * Removes all invitations to the workspace.
 * @throws {ApiError} When the workspace document is not found, is placed in the recycle bin
 * already or has the deleted flag set.
 * When the document of the user using the api is not found or has the deleted flag set.
 * When the user using the api does not belong to the workspace
 */
export default async function moveWorkspaceToRecycleBin(
  uid: string,
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userRef = collections.users.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const invitedUsersQuery = collections.users
    .where("isDeleted", "==", false)
    .where("workspaceInvitationIds", "array-contains", workspaceId);
  /**
   * The transaction prevents modifying the workspace when it is being put to the recycle bin.
   */
  await adminDb.runTransaction(async (transaction) => {
    const userPromise = transaction.get(userRef);
    const workspacePromise = transaction.get(workspaceRef);
    const invitedUsersPromise = transaction.get(invitedUsersQuery);
    await Promise.all([userPromise, workspacePromise, invitedUsersPromise]);
    const user = (await userPromise).data();
    if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
    const workspace = (await workspacePromise).data();
    if (!workspace)
      throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
    assertWorkspaceWriteable(workspace, user);
    const invitedUsersSnap = (await invitedUsersPromise).docs;
    for (const invitedUserDoc of invitedUsersSnap) {
      transaction.update(invitedUserDoc.ref, {
        workspaceInvitationIds: adminArrayRemove<User, "workspaceInvitationIds">(workspaceId),
        modificationTime: FieldValue.serverTimestamp() as Timestamp,
      });
      transaction.update(collections.userDetails.doc(invitedUserDoc.id), {
        hiddenWorkspaceInvitationsIds: adminArrayRemove<
          UserDetails,
          "hiddenWorkspaceInvitationsIds"
        >(workspaceId),
      });
    }
    transaction.update(workspaceRef, {
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp() as Timestamp,
      insertedIntoBinByUserId: uid,
    });
    transaction.update(collections.workspaceSummaries.doc(workspaceId), {
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp() as Timestamp,
      insertedIntoBinByUserId: uid,
    });
  });
}
