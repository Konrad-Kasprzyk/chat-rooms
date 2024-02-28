import adminCollections from "backend/db/adminCollections.firebase";
import mapUsersHistoryDTO from "client/utils/mappers/historyMappers/mapUsersHistoryDTO.util";
import mapWorkspaceDTO from "client/utils/mappers/mapWorkspaceDTO.util";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import Workspace from "common/clientModels/workspace.model";

export default async function compareNewestUsersHistoryRecord(
  workspaceOrWorkspaceId: Workspace | WorkspaceDTO | string,
  historyRecord: {
    action: UsersHistory["history"][number]["action"];
    userId: UsersHistory["history"][number]["userId"];
    date: UsersHistory["history"][number]["date"];
    oldValue: UsersHistory["history"][number]["oldValue"];
    value: UsersHistory["history"][number]["value"];
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
  const usersHistoryDTO = (
    await adminCollections.userHistories.doc(workspace.newestUsersHistoryId).get()
  ).data()!;
  const usersHistory = mapUsersHistoryDTO(usersHistoryDTO);
  const newestRecord = usersHistory.history[usersHistory.historyRecordsCount - 1];
  expect(newestRecord).toEqual({ ...historyRecord, id: newestRecord.id, user: null });
}
