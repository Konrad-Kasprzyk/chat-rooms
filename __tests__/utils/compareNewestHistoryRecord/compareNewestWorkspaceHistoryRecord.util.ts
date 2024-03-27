import adminCollections from "backend/db/adminCollections.firebase";
import mapWorkspaceHistoryDTO from "client/utils/mappers/historyMappers/mapWorkspaceHistoryDTO.util";
import mapWorkspaceDTO from "client/utils/mappers/mapWorkspaceDTO.util";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import Workspace from "common/clientModels/workspace.model";

export default async function compareNewestWorkspaceHistoryRecord(
  workspaceOrWorkspaceId: Workspace | WorkspaceDTO | string,
  historyRecord: {
    action: WorkspaceHistory["history"][number]["action"];
    userId: WorkspaceHistory["history"][number]["userId"];
    date: WorkspaceHistory["history"][number]["date"];
    oldValue: WorkspaceHistory["history"][number]["oldValue"];
    value: WorkspaceHistory["history"][number]["value"];
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
  const workspaceHistoryDTO = (
    await adminCollections.workspaceHistories.doc(workspace.newestWorkspaceHistoryId).get()
  ).data()!;
  const workspaceHistory = mapWorkspaceHistoryDTO(workspaceHistoryDTO);
  const newestRecord = workspaceHistory.history[workspaceHistory.historyRecordsCount - 1];
  expect(newestRecord).toEqual({ ...historyRecord, id: newestRecord.id, user: null });
}
