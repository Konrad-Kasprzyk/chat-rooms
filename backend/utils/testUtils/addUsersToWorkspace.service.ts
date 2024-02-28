import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminArrayUnion from "backend/db/adminArrayUnion.util";
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
 * Adds provided user ids to the workspace and invites provided emails to the workspace.
 * @throws {ApiError} When the number of user ids exceeds 10 or the number of user emails exceeds 10.
 * When the workspace is not found or has the deleted flag set. When any of the
 * user documents from provided ids or emails are not found or have the deleted flag set.
 */
export default async function addUsersToWorkspace(
  userIds: string[],
  userEmails: string[],
  workspaceId: string,
  testCollections: typeof adminCollections
): Promise<void> {
  if (userIds.length == 0 && userEmails.length == 0) return;
  if (userIds.length > 10)
    throw new ApiError(400, "The number of user ids to add to the workspace exceeds 10");
  if (userEmails.length > 10)
    throw new ApiError(400, "The number of user emails to invite to the workspace exceeds 10");
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
  const userIdsToAdd = userIds.filter((uid) => !workspace.userIds.includes(uid));
  const userEmailsToInvite = userEmails.filter(
    (email) => !workspace.invitedUserEmails.includes(email)
  );
  let usersToAdd: UserDTO[] = [];
  if (userIdsToAdd.length > 0) {
    const usersToAddSnap = await testCollections.users.where("id", "in", userIdsToAdd).get();
    usersToAdd = usersToAddSnap.docs.map((docSnap) => docSnap.data());
  }
  let userDetailsToAdd: UserDetailsDTO[] = [];
  if (userIdsToAdd.length > 0) {
    const userDetailsToAddSnap = await testCollections.userDetails
      .where("id", "in", userIdsToAdd)
      .get();
    userDetailsToAdd = userDetailsToAddSnap.docs.map((docSnap) => docSnap.data());
  }
  let usersToInvite: UserDTO[] = [];
  if (userEmailsToInvite.length > 0) {
    const usersToInviteSnap = await testCollections.users
      .where("email", "in", userEmailsToInvite)
      .get();
    usersToInvite = usersToInviteSnap.docs.map((docSnap) => docSnap.data());
  }
  const batch = adminDb.batch();
  for (const userToAdd of usersToAdd) {
    if (userToAdd.isDeleted)
      throw new ApiError(400, `The user with id ${userToAdd.id} has the deleted flag set.`);
    batch.update(testCollections.users.doc(userToAdd.id), {
      workspaceIds: adminArrayUnion<UserDTO, "workspaceIds">(workspaceId),
      workspaceInvitationIds: adminArrayRemove<UserDTO, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp(),
    });
    batch.update(testCollections.userDetails.doc(userToAdd.id), {
      hiddenWorkspaceInvitationIds: adminArrayRemove<
        UserDetailsDTO,
        "hiddenWorkspaceInvitationIds"
      >(workspaceId),
    });
  }
  for (const userDetails of userDetailsToAdd) {
    batch.update(testCollections.userDetails.doc(userDetails.mainUserId), {
      allLinkedUserBelongingWorkspaceIds: adminArrayUnion<
        UserDetailsDTO,
        "allLinkedUserBelongingWorkspaceIds"
      >(workspaceId),
    });
  }
  for (const userToInvite of usersToInvite) {
    if (userToInvite.isDeleted)
      throw new ApiError(
        400,
        `The user with email ${userToInvite.email} has the deleted flag set.`
      );
    batch.update(testCollections.users.doc(userToInvite.id), {
      workspaceInvitationIds: adminArrayUnion<UserDTO, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp(),
    });
  }
  const workspaceSummaryRef = testCollections.workspaceSummaries.doc(workspaceId);
  if (userIdsToAdd.length > 0) {
    batch.update(workspaceRef, {
      userIds: adminArrayUnion<WorkspaceDTO, "userIds">(...userIdsToAdd),
      invitedUserEmails: adminArrayRemove<WorkspaceDTO, "invitedUserEmails">(
        ...usersToAdd.map((user) => user.email)
      ),
      modificationTime: FieldValue.serverTimestamp(),
    });
    batch.update(workspaceSummaryRef, {
      userIds: adminArrayUnion<WorkspaceSummaryDTO, "userIds">(...userIdsToAdd),
      invitedUserIds: adminArrayRemove<WorkspaceSummaryDTO, "invitedUserIds">(...userIdsToAdd),
      modificationTime: FieldValue.serverTimestamp(),
    });
    for (const userIdToAdd of userIdsToAdd) {
      usersHistory.history[usersHistory.historyRecordsCount.toString()] = {
        id:
          usersHistory.historyRecordsCount == 0
            ? 0
            : usersHistory.history[(usersHistory.historyRecordsCount - 1).toString()].id + 1,
        action: "userIds" as const,
        userId: userIdToAdd,
        date: FieldValue.serverTimestamp() as Timestamp,
        oldValue: null,
        value: userIdToAdd,
      };
      usersHistory.historyRecordsCount++;
    }
  }
  if (userEmailsToInvite.length > 0) {
    batch.update(workspaceRef, {
      invitedUserEmails: adminArrayUnion<WorkspaceDTO, "invitedUserEmails">(...userEmailsToInvite),
      modificationTime: FieldValue.serverTimestamp(),
    });
    batch.update(workspaceSummaryRef, {
      invitedUserIds: adminArrayUnion<WorkspaceSummaryDTO, "invitedUserIds">(
        ...usersToInvite.map((user) => user.id)
      ),
      modificationTime: FieldValue.serverTimestamp(),
    });
    for (const userToInvite of usersToInvite) {
      usersHistory.history[usersHistory.historyRecordsCount.toString()] = {
        id:
          usersHistory.historyRecordsCount == 0
            ? 0
            : usersHistory.history[(usersHistory.historyRecordsCount - 1).toString()].id + 1,
        action: "invitedUserEmails" as const,
        userId: userToInvite.id,
        date: FieldValue.serverTimestamp() as Timestamp,
        oldValue: null,
        value: userToInvite.email,
      };
      usersHistory.historyRecordsCount++;
    }
  }
  if (userIdsToAdd.length > 0 || userEmailsToInvite.length > 0) {
    const usersHistoryUpdates: Partial<UsersHistoryDTO> = {
      history: usersHistory.history,
      historyRecordsCount: usersHistory.historyRecordsCount,
      modificationTime: FieldValue.serverTimestamp() as Timestamp,
    };
    batch.update(workspaceUsersHistoryRef, usersHistoryUpdates as UpdateData<UsersHistoryDTO>);
  }
  await batch.commit();
}
