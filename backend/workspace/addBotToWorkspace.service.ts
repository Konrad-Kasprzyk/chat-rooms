import adminArrayRemove from "backend/db/adminArrayRemove.util";
import adminArrayUnion from "backend/db/adminArrayUnion.util";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
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
  const workspaceRef = collections.workspaces.doc(workspaceId);
  const botRef = collections.users.doc(botId);
  const userPromise = userRef.get();
  const workspacePromise = workspaceRef.get();
  const botPromise = botRef.get();
  await Promise.all([userPromise, workspacePromise, botPromise]);
  const user = (await userPromise).data();
  if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
  const workspace = (await workspaceRef.get()).data();
  if (!workspace)
    throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
  assertWorkspaceWriteable(workspace, user);
  const bot = (await botPromise).data();
  if (!bot) throw new ApiError(400, `The user's bot document with id ${botId} not found.`);
  if (!user.linkedUserDocumentIds.includes(botId))
    throw new ApiError(400, `The bot with id ${botId} does not belong to the user with id ${uid}`);
  if (bot.workspaceIds.includes(workspaceId))
    throw new ApiError(
      400,
      `The bot with id ${botId} already belongs to the workspace with id ${workspaceId}`
    );
  const batch = adminDb.batch();
  batch.update(botRef, {
    workspaceIds: adminArrayUnion<UserDTO, "workspaceIds">(workspaceId),
    workspaceInvitationIds: adminArrayRemove<UserDTO, "workspaceInvitationIds">(workspaceId),
    modificationTime: FieldValue.serverTimestamp(),
  });
  batch.update(collections.userDetails.doc(botId), {
    hiddenWorkspaceInvitationIds: adminArrayRemove<UserDetailsDTO, "hiddenWorkspaceInvitationIds">(
      workspaceId
    ),
  });
  batch.update(workspaceRef, {
    userIds: adminArrayUnion<WorkspaceDTO, "userIds">(botId),
    invitedUserEmails: adminArrayRemove<WorkspaceDTO, "invitedUserEmails">(bot.email),
    modificationTime: FieldValue.serverTimestamp(),
  });
  batch.update(collections.workspaceSummaries.doc(workspaceId), {
    userIds: adminArrayUnion<WorkspaceSummaryDTO, "userIds">(botId),
    invitedUserIds: adminArrayRemove<WorkspaceSummaryDTO, "invitedUserIds">(botId),
    modificationTime: FieldValue.serverTimestamp(),
  });
  await batch.commit();
}
