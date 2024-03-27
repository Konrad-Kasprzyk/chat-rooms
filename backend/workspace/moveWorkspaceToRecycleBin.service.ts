import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import addHistoryRecord from "backend/utils/docUtils/addHistoryRecord.util";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

/**
 * Marks the workspace as put in the recycle bin if it is not already there.
 * Removes all invitations to the workspace.
 * @throws {ApiError} When the workspace document is not found, is placed in the recycle bin
 * already or has the deleted flag set.
 * When the document of the user using the api is not found.
 * When the user using the api does not belong to the workspace
 */
export default async function moveWorkspaceToRecycleBin(
  uid: string,
  workspaceId: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userRef = collections.users.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const invitedUsersQuery = collections.users.where(
    "workspaceInvitationIds",
    "array-contains",
    workspaceId
  );
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
    const usersHistoryRef = collections.userHistories.doc(workspace.newestUsersHistoryId);
    const usersHistory = (await transaction.get(usersHistoryRef)).data();
    if (!usersHistory)
      throw new ApiError(
        500,
        `Found the workspace document, but couldn't find the workspace users history document ` +
          `with id ${workspace.newestUsersHistoryId}`
      );
    const workspaceHistoryRef = collections.workspaceHistories.doc(
      workspace.newestWorkspaceHistoryId
    );
    const workspaceHistory = (await transaction.get(workspaceHistoryRef)).data();
    if (!workspaceHistory)
      throw new ApiError(
        500,
        `Found the workspace document, but couldn't find the workspace history document ` +
          `with id ${workspace.newestWorkspaceHistoryId}`
      );
    assertWorkspaceWriteable(workspace, user);
    /**
     * A user document and a user details document typically weigh less than 1kB, so it is safe to
     * retrieve and update all users in a single transaction. The transaction update limit is 10MiB.
     */
    const invitedUsersSnap = (await invitedUsersPromise).docs;
    for (const invitedUserDoc of invitedUsersSnap) {
      transaction.update(invitedUserDoc.ref, {
        workspaceInvitationIds: adminArrayRemove<UserDTO, "workspaceInvitationIds">(workspaceId),
        modificationTime: FieldValue.serverTimestamp(),
      });
      transaction.update(collections.userDetails.doc(invitedUserDoc.id), {
        hiddenWorkspaceInvitationIds: adminArrayRemove<
          UserDetailsDTO,
          "hiddenWorkspaceInvitationIds"
        >(workspaceId),
      });
    }
    transaction.update(workspaceRef, {
      invitedUserEmails: [],
      modificationTime: FieldValue.serverTimestamp(),
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp(),
    });
    transaction.update(collections.workspaceSummaries.doc(workspaceId), {
      invitedUserIds: [],
      modificationTime: FieldValue.serverTimestamp(),
      isInBin: true,
      placingInBinTime: FieldValue.serverTimestamp(),
    });
    addHistoryRecord<UsersHistoryDTO>(
      transaction,
      usersHistory,
      {
        action: "allInvitationsCancel" as const,
        userId: uid,
        oldValue: workspace.invitedUserEmails,
        value: null,
      },
      collections.userHistories
    );
    addHistoryRecord<WorkspaceHistoryDTO>(
      transaction,
      workspaceHistory,
      {
        action: "placingInBinTime" as const,
        userId: uid,
        oldValue: null,
        value: FieldValue.serverTimestamp() as Timestamp,
      },
      collections.workspaceHistories
    );
  });
}
