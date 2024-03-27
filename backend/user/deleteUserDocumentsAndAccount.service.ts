import OPTIMAL_MAX_OPERATIONS_PER_COMMIT from "backend/constants/optimalMaxOperationsPerCommit.constant";
import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminAuth from "backend/db/adminAuth.firebase";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import addHistoryRecord from "backend/utils/docUtils/addHistoryRecord.util";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Four operations per workspace: remove linked users from workspace, remove linked users from
 * workspace summary, add removed linked users to a workspace users history and possibly split
 * history records into a new users history document if the limit of history records per
 * document is exceeded.
 */
const operationsPerWorkspace = 4;

/**
 * Deletes actual user documents and linked bots documents. Deletes the user account. Removes all
 * linked users from the workspaces they belong to or are invited to. Deletes the user account even
 * if the user document is not found
 */
export default async function deleteUserDocumentsAndAccount(
  uid: string,
  collections: typeof adminCollections = adminCollections
): Promise<void> {
  const userDetailsRef = collections.userDetails.doc(uid);
  const userDetails = (await userDetailsRef.get()).data();
  if (!userDetails) {
    await adminAuth.deleteUser(uid);
    return;
  }
  const allLinkedUserDocsQuery = collections.users.where(
    "id",
    "in",
    userDetails.linkedUserDocumentIds
  );
  const maxWorkspacesPerTransaction = Math.ceil(
    OPTIMAL_MAX_OPERATIONS_PER_COMMIT / operationsPerWorkspace
  );
  let allWorkspaceProcessed = false;
  while (!allWorkspaceProcessed)
    await adminDb.runTransaction(async (transaction) => {
      const allLinkedUserDocsSnap = await transaction.get(allLinkedUserDocsQuery);
      const allLinkedUserDocs = allLinkedUserDocsSnap.docs.map((doc) => doc.data());
      const allBelongingOrInvitedWorkspaceIds = [];
      for (const userDoc of allLinkedUserDocs) {
        allBelongingOrInvitedWorkspaceIds.push(...userDoc.workspaceIds);
        allBelongingOrInvitedWorkspaceIds.push(...userDoc.workspaceInvitationIds);
      }
      // Remove duplicate workspace ids
      const allBelongingOrInvitedWorkspaceIdsSet = new Set(allBelongingOrInvitedWorkspaceIds);
      // Check if all workspaces will be processed in this transaction
      if (allBelongingOrInvitedWorkspaceIdsSet.size <= maxWorkspacesPerTransaction)
        allWorkspaceProcessed = true;
      if (allBelongingOrInvitedWorkspaceIdsSet.size > 0) {
        // Take only maxWorkspacesPerTransaction ids to process in this transaction
        const workspaceIdsToRemoveUser = Array.from(allBelongingOrInvitedWorkspaceIdsSet).slice(
          0,
          maxWorkspacesPerTransaction
        );
        const workspacePromises = workspaceIdsToRemoveUser.map((workspaceId) =>
          transaction.get(collections.workspaces.doc(workspaceId))
        );
        await Promise.all(workspacePromises);
        const workspacesWithHistoryToProcess: {
          workspace: WorkspaceDTO;
          usersHistory: UsersHistoryDTO;
        }[] = [];
        const usersHistoryPromises = [];
        for (const workspacePromise of workspacePromises) {
          const workspace = (await workspacePromise).data();
          if (!workspace || workspace.isDeleted) continue;
          usersHistoryPromises.push(
            transaction
              .get(collections.userHistories.doc(workspace.newestUsersHistoryId))
              .then((usersHistorySnap) => {
                const usersHistory = usersHistorySnap.data();
                if (!usersHistory)
                  throw new ApiError(
                    500,
                    `Found the workspace document, but couldn't find the workspace users history document ` +
                      `with id ${workspace.newestUsersHistoryId}`
                  );
                workspacesWithHistoryToProcess.push({ workspace, usersHistory });
              })
          );
        }
        await Promise.all(usersHistoryPromises);
        for (const workspaceWithHistory of workspacesWithHistoryToProcess) {
          const workspace = workspaceWithHistory.workspace;
          const usersHistory = workspaceWithHistory.usersHistory;
          transaction.update(collections.workspaces.doc(workspace.id), {
            userIds: adminArrayRemove<WorkspaceDTO, "userIds">(
              ...userDetails.linkedUserDocumentIds
            ),
            invitedUserEmails: adminArrayRemove<WorkspaceDTO, "invitedUserEmails">(
              ...allLinkedUserDocs.map((user) => user.email)
            ),
            modificationTime: FieldValue.serverTimestamp(),
          });
          transaction.update(collections.workspaceSummaries.doc(workspace.id), {
            userIds: adminArrayRemove<WorkspaceSummaryDTO, "userIds">(
              ...userDetails.linkedUserDocumentIds
            ),
            invitedUserIds: adminArrayRemove<WorkspaceSummaryDTO, "invitedUserIds">(
              ...userDetails.linkedUserDocumentIds
            ),
            modificationTime: FieldValue.serverTimestamp(),
          });
          const removedBelongingUsers = allLinkedUserDocs.filter((user) =>
            workspace.userIds.includes(user.id)
          );
          const removedInvitedUsers = allLinkedUserDocs.filter((user) =>
            workspace.invitedUserEmails.includes(user.email)
          );
          for (const userToRemove of removedBelongingUsers)
            addHistoryRecord<UsersHistoryDTO>(
              transaction,
              usersHistory,
              {
                action: "userRemovedFromWorkspace" as const,
                userId: userToRemove.id,
                oldValue: {
                  id: userToRemove.id,
                  email: userToRemove.email,
                  username: userToRemove.username,
                  isBotUserDocument: userToRemove.isBotUserDocument,
                },
                value: null,
              },
              collections.userHistories
            );
          for (const userToCancelInvitation of removedInvitedUsers)
            addHistoryRecord<UsersHistoryDTO>(
              transaction,
              usersHistory,
              {
                action: "invitedUserEmails" as const,
                userId: userToCancelInvitation.id,
                oldValue: userToCancelInvitation.email,
                value: null,
              },
              collections.userHistories
            );
        }
        for (const docId of userDetails.linkedUserDocumentIds) {
          transaction.update(collections.users.doc(docId), {
            workspaceIds: adminArrayRemove<UserDTO, "workspaceIds">(...workspaceIdsToRemoveUser),
            workspaceInvitationIds: adminArrayRemove<UserDTO, "workspaceInvitationIds">(
              ...workspaceIdsToRemoveUser
            ),
            modificationTime: FieldValue.serverTimestamp(),
          });
          transaction.update(collections.userDetails.doc(docId), {
            hiddenWorkspaceInvitationIds: adminArrayRemove<
              UserDetailsDTO,
              "hiddenWorkspaceInvitationIds"
            >(...workspaceIdsToRemoveUser),
            allLinkedUserBelongingWorkspaceIds: adminArrayRemove<
              UserDetailsDTO,
              "allLinkedUserBelongingWorkspaceIds"
            >(...workspaceIdsToRemoveUser),
          });
        }
      }
      if (allWorkspaceProcessed)
        for (const docId of userDetails.linkedUserDocumentIds) {
          transaction.delete(collections.users.doc(docId));
          transaction.delete(collections.userDetails.doc(docId));
        }
    });
  await adminAuth.deleteUser(uid);
}

export const _markUserDeletedExportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        operationsPerWorkspace,
      }
    : undefined;
