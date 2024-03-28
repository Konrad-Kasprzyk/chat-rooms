import adminCollections from "backend/db/adminCollections.firebase";
import mapChatHistoryDTO from "client/utils/mappers/historyMappers/mapChatHistoryDTO.util";
import mapWorkspaceDTO from "client/utils/mappers/mapWorkspaceDTO.util";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import ChatHistory from "common/clientModels/historyModels/chatHistory.model";
import Workspace from "common/clientModels/workspace.model";

export default async function compareNewestChatHistoryRecord(
  workspaceOrWorkspaceId: Workspace | WorkspaceDTO | string,
  historyRecord: {
    action: ChatHistory["history"][number]["action"];
    userId: ChatHistory["history"][number]["userId"];
    date: ChatHistory["history"][number]["date"];
    oldValue: ChatHistory["history"][number]["oldValue"];
    value: ChatHistory["history"][number]["value"];
  }
): Promise<void> {
  let workspace: Workspace | WorkspaceDTO;
  if (typeof workspaceOrWorkspaceId === "string") {
    const workspaceDTO = (
      await adminCollections.workspaces.doc(workspaceOrWorkspaceId).get()
    ).data()!;
    workspace = mapWorkspaceDTO(workspaceDTO);
  } else {
    workspace = workspaceOrWorkspaceId;
  }
  const chatHistoryDTO = (
    await adminCollections.chatHistories.doc(workspace.newestChatHistoryId).get()
  ).data()!;
  const chatHistory = mapChatHistoryDTO(chatHistoryDTO);
  const newestRecord = chatHistory.history[chatHistory.historyRecordsCount - 1];
  expect(newestRecord).toEqual({ ...historyRecord, id: newestRecord.id, user: null });
}
