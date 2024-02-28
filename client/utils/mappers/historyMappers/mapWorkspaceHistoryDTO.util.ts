import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";
import HistoryModelSchema from "common/clientModels/historyModels/historyModelSchema.interface";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";

export default function mapWorkspaceHistoryDTO(
  workspaceHistoryDTO: WorkspaceHistoryDTO
): WorkspaceHistory {
  const historyRecordsDTO = [];
  for (let i = 0; i < workspaceHistoryDTO.historyRecordsCount; i++)
    historyRecordsDTO.push(workspaceHistoryDTO.history[i]);
  const historyRecords: HistoryModelSchema["history"] = historyRecordsDTO.map((recordDTO) => {
    let mappedRecordValue: WorkspaceHistory["history"][number]["value"];
    let mappedRecordOldValue: WorkspaceHistory["history"][number]["oldValue"];
    switch (recordDTO.action) {
      case "creationTime":
      case "placingInBinTime":
        mappedRecordValue = recordDTO.value == null ? null : recordDTO.value.toDate();
        mappedRecordOldValue = recordDTO.oldValue == null ? null : recordDTO.oldValue.toDate();
        break;
      default:
        mappedRecordValue = recordDTO.value;
        mappedRecordOldValue = recordDTO.oldValue;
    }
    return {
      ...recordDTO,
      user: null,
      date: recordDTO.date.toDate(),
      value: mappedRecordValue,
      oldValue: mappedRecordOldValue,
    };
  });
  const mappedWorkspaceHistory: WorkspaceHistory &
    Partial<Omit<WorkspaceHistoryDTO, keyof WorkspaceHistory>> = {
    ...workspaceHistoryDTO,
    history: historyRecords as WorkspaceHistory["history"],
    modificationTime: workspaceHistoryDTO.modificationTime.toDate(),
  };
  return mappedWorkspaceHistory;
}
