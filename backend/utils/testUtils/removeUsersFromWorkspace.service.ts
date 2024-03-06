import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue, Timestamp, UpdateData } from "firebase-admin/firestore";

/**
 * Removes provided user ids from the workspace and cancels provided email invitations to the workspace.
 * @throws {ApiError} When the workspace is not found or has the deleted flag set. When any of the
 * user documents from provided ids or emails are not found.
 */
export default async function removeUsersFromWorkspace(
  userIds: string[],
  userEmails: string[],
  workspaceId: string,
  testCollections: typeof adminCollections
): Promise<void> {
  if (userIds.length == 0 && userEmails.length == 0) return;
  const workspaceRef = testCollections.workspaces.doc(workspaceId);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace) throw new ApiError(400, `Couldn't find the workspace with id ${workspaceId}`);
  if (workspace.isDeleted)
    throw new ApiError(400, `The workspace with id ${workspaceId} has the deleted flag set.`);
  const workspaceUsersHistoryRef = testCollections.userHistories.doc(
    workspace.newestUsersHistoryId
  );
  const usersHistory = (await workspaceUsersHistoryRef.get()).data();
  if (!usersHistory)
    throw new ApiError(
      500,
      `Found the workspace document, but couldn't find the workspace users history document ` +
        `with id ${workspace.newestUsersHistoryId}`
    );
  const userIdsToRemove = userIds.filter((uid) => workspace.userIds.includes(uid));
  const userEmailsToRemove = userEmails.filter((email) =>
    workspace.invitedUserEmails.includes(email)
  );
  let usersToRemove: UserDTO[] = [];
  if (userIdsToRemove.length > 0) {
    const usersToRemoveSnap = await testCollections.users.where("id", "in", userIdsToRemove).get();
    usersToRemove = usersToRemoveSnap.docs.map((docSnap) => docSnap.data());
  }
  let userDetailsToRemove: UserDetailsDTO[] = [];
  if (userIdsToRemove.length > 0) {
    const userDetailsToRemoveSnap = await testCollections.userDetails
      .where("id", "in", userIdsToRemove)
      .get();
    userDetailsToRemove = userDetailsToRemoveSnap.docs.map((docSnap) => docSnap.data());
  }
  let usersToCancelInvitation: UserDTO[] = [];
  if (userEmailsToRemove.length > 0) {
    const usersToCancelInvitationSnap = await testCollections.users
      .where("email", "in", userEmailsToRemove)
      .get();
    usersToCancelInvitation = usersToCancelInvitationSnap.docs.map((docSnap) => docSnap.data());
  }
  const batch = adminDb.batch();
  for (const userToRemove of usersToRemove) {
    batch.update(testCollections.users.doc(userToRemove.id), {
      workspaceIds: adminArrayRemove<UserDTO, "workspaceIds">(workspaceId),
      workspaceInvitationIds: adminArrayRemove<UserDTO, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp(),
    });
    batch.update(testCollections.userDetails.doc(userToRemove.id), {
      hiddenWorkspaceInvitationIds: adminArrayRemove<
        UserDetailsDTO,
        "hiddenWorkspaceInvitationIds"
      >(workspaceId),
    });
  }
  const workspaceUserIdsAfterUserRemoval = workspace.userIds.filter(
    (userId) => !userIdsToRemove.includes(userId)
  );
  for (const userDetails of userDetailsToRemove) {
    if (
      !workspaceUserIdsAfterUserRemoval.some((userId) =>
        userDetails.linkedUserDocumentIds.includes(userId)
      )
    ) {
      batch.update(testCollections.userDetails.doc(userDetails.mainUserId), {
        allLinkedUserBelongingWorkspaceIds: adminArrayRemove<
          UserDetailsDTO,
          "allLinkedUserBelongingWorkspaceIds"
        >(workspaceId),
      });
    }
  }
  for (const userToCancelInvitation of usersToCancelInvitation) {
    batch.update(testCollections.users.doc(userToCancelInvitation.id), {
      workspaceInvitationIds: adminArrayRemove<UserDTO, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp(),
    });
    batch.update(testCollections.userDetails.doc(userToCancelInvitation.id), {
      hiddenWorkspaceInvitationIds: adminArrayRemove<
        UserDetailsDTO,
        "hiddenWorkspaceInvitationIds"
      >(workspaceId),
    });
  }
  const workspaceSummaryRef = testCollections.workspaceSummaries.doc(workspaceId);
  if (userIdsToRemove.length > 0) {
    batch.update(workspaceRef, {
      userIds: adminArrayRemove<WorkspaceDTO, "userIds">(...userIdsToRemove),
      modificationTime: FieldValue.serverTimestamp(),
    });
    batch.update(workspaceSummaryRef, {
      userIds: adminArrayRemove<WorkspaceSummaryDTO, "userIds">(...userIdsToRemove),
      modificationTime: FieldValue.serverTimestamp(),
    });
    for (const userToRemove of usersToRemove) {
      usersHistory.history[usersHistory.historyRecordsCount.toString()] = {
        id:
          usersHistory.historyRecordsCount == 0
            ? 0
            : usersHistory.history[(usersHistory.historyRecordsCount - 1).toString()].id + 1,
        action: "userRemovedFromWorkspace" as const,
        userId: userToRemove.id,
        date: FieldValue.serverTimestamp() as Timestamp,
        oldValue: {
          id: userToRemove.id,
          email: userToRemove.email,
          username: userToRemove.username,
          isBotUserDocument: userToRemove.isBotUserDocument,
        },
        value: null,
      };
      usersHistory.historyRecordsCount++;
    }
  }
  if (userEmailsToRemove.length > 0) {
    batch.update(workspaceRef, {
      invitedUserEmails: adminArrayRemove<WorkspaceDTO, "invitedUserEmails">(...userEmailsToRemove),
      modificationTime: FieldValue.serverTimestamp(),
    });
    batch.update(workspaceSummaryRef, {
      invitedUserIds: adminArrayRemove<WorkspaceSummaryDTO, "invitedUserIds">(
        ...usersToCancelInvitation.map((user) => user.id)
      ),
      modificationTime: FieldValue.serverTimestamp(),
    });
    for (const userToCancelInvitation of usersToCancelInvitation) {
      usersHistory.history[usersHistory.historyRecordsCount.toString()] = {
        id:
          usersHistory.historyRecordsCount == 0
            ? 0
            : usersHistory.history[(usersHistory.historyRecordsCount - 1).toString()].id + 1,
        action: "invitedUserEmails" as const,
        userId: userToCancelInvitation.id,
        date: FieldValue.serverTimestamp() as Timestamp,
        oldValue: userToCancelInvitation.email,
        value: null,
      };
      usersHistory.historyRecordsCount++;
    }
  }
  if (userIdsToRemove.length > 0 || userEmailsToRemove.length > 0) {
    const usersHistoryUpdates: Partial<UsersHistoryDTO> = {
      history: usersHistory.history,
      historyRecordsCount: usersHistory.historyRecordsCount,
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    };
    batch.update(workspaceUsersHistoryRef, usersHistoryUpdates as UpdateData<UsersHistoryDTO>);
  }
  await batch.commit();
}
