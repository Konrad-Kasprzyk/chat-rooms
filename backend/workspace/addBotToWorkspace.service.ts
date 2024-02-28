import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import addHistoryRecord from "backend/utils/docUtils/addHistoryRecord.util";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import ApiError from "common/types/apiError.class";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Adds the provided bot to the workspace. This bot must belong to the signed in user.
 * Bot can add another bot and the signed in user as well.
 * @throws {ApiError} When the user or the user's bot document is not found.
 * When the user does not belong to the workspace or has the deleted flag set.
 * When the bot belongs to the workspace already.
 * When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
 */
export default async function addBotToWorkspace(
  uid: string,
  workspaceId: string,
  botId: string,
  collections: typeof adminCollections = adminCollections
) {
  const userRef = collections.users.doc(uid);
  const userDetailsRef = collections.userDetails.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const botRef = collections.users.doc(botId);
  await adminDb.runTransaction(async (transaction) => {
    const userPromise = userRef.get();
    const userDetailsPromise = userDetailsRef.get();
    const workspacePromise = workspaceRef.get();
    const botPromise = botRef.get();
    await Promise.all([userPromise, userDetailsPromise, workspacePromise, botPromise]);
    const user = (await userPromise).data();
    if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
    const userDetails = (await userDetailsPromise).data();
    if (!userDetails)
      throw new ApiError(
        500,
        `Found the user document, but the user details document with id ${uid} is not found.`
      );
    const workspace = (await workspaceRef.get()).data();
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
    assertWorkspaceWriteable(workspace, user);
    const bot = (await botPromise).data();
    if (!bot) throw new ApiError(400, `The user's bot document with id ${botId} not found.`);
    if (!userDetails.linkedUserDocumentIds.includes(botId))
      throw new ApiError(
        400,
        `The bot with id ${botId} does not belong to the user with id ${uid}`
      );
    if (bot.workspaceIds.includes(workspaceId))
      throw new ApiError(
        400,
        `The bot with id ${botId} already belongs to the workspace with id ${workspaceId}`
      );
    transaction.update(botRef, {
      workspaceIds: adminArrayUnion<UserDTO, "workspaceIds">(workspaceId),
      workspaceInvitationIds: adminArrayRemove<UserDTO, "workspaceInvitationIds">(workspaceId),
      modificationTime: FieldValue.serverTimestamp(),
    });
    transaction.update(collections.userDetails.doc(botId), {
      hiddenWorkspaceInvitationIds: adminArrayRemove<
        UserDetailsDTO,
        "hiddenWorkspaceInvitationIds"
      >(workspaceId),
    });
    transaction.update(workspaceRef, {
      userIds: adminArrayUnion<WorkspaceDTO, "userIds">(botId),
      invitedUserEmails: adminArrayRemove<WorkspaceDTO, "invitedUserEmails">(bot.email),
      modificationTime: FieldValue.serverTimestamp(),
    });
    transaction.update(collections.workspaceSummaries.doc(workspaceId), {
      userIds: adminArrayUnion<WorkspaceSummaryDTO, "userIds">(botId),
      invitedUserIds: adminArrayRemove<WorkspaceSummaryDTO, "invitedUserIds">(botId),
      modificationTime: FieldValue.serverTimestamp(),
    });
    addHistoryRecord<UsersHistoryDTO>(
      transaction,
      usersHistory,
      {
        action: "userIds" as const,
        userId: uid,
        oldValue: null,
        value: botId,
      },
      collections.userHistories
    );
  });
}
