import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import assertWorkspaceWriteable from "backend/utils/assertWorkspaceWriteable.util";
import addHistoryRecord from "backend/utils/docUtils/addHistoryRecord.util";
import ChatHistoryDTO from "common/DTOModels/historyModels/chatHistoryDTO.model";
import ApiError from "common/types/apiError.class";

/**
 * Sends a new message to the chat room.
 * @throws {ApiError} When the message is an empty string.
 * When the user document is not found.
 * When the user does not belong to the workspace.
 * When the workspace document is not found, is placed in the recycle bin
 * or has the deleted flag set.
 */
export default async function sendMessage(
  uid: string,
  workspaceId: string,
  message: string,
  collections: typeof adminCollections = adminCollections
) {
  if (!message) throw new ApiError(400, "The message to send is an empty string.");
  const userRef = collections.users.doc(uid);
  const workspaceRef = collections.workspaces.doc(workspaceId);
  await adminDb.runTransaction(async (transaction) => {
    const userPromise = userRef.get();
    const workspacePromise = workspaceRef.get();
    await Promise.all([userPromise, workspacePromise]);
    const user = (await userPromise).data();
    if (!user) throw new ApiError(400, `The user document with id ${uid} not found.`);
    const workspace = (await workspaceRef.get()).data();
    if (!workspace)
      throw new ApiError(400, `The workspace document with id ${workspaceId} not found.`);
    const chatHistoryRef = collections.chatHistories.doc(workspace.newestChatHistoryId);
    const chatHistory = (await transaction.get(chatHistoryRef)).data();
    if (!chatHistory)
      throw new ApiError(
        500,
        `Found the workspace document, but couldn't find the chat history document ` +
          `with id ${workspace.newestChatHistoryId}`
      );
    assertWorkspaceWriteable(workspace, user);
    addHistoryRecord<ChatHistoryDTO>(
      transaction,
      chatHistory,
      {
        action: "message" as const,
        userId: uid,
        oldValue: "",
        value: message,
      },
      collections.chatHistories
    );
  });
}
