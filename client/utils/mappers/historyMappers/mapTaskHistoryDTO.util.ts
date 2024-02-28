import TaskHistoryDTO from "common/DTOModels/historyModels/taskHistoryDTO.model";
import HistoryModelSchema from "common/clientModels/historyModels/historyModelSchema.interface";
import TaskHistory from "common/clientModels/historyModels/taskHistory.model";

export default function mapTaskHistoryDTO(taskHistoryDTO: TaskHistoryDTO): TaskHistory {
  const historyRecordsDTO = [];
  for (let i = 0; i < taskHistoryDTO.historyRecordsCount; i++)
    historyRecordsDTO.push(taskHistoryDTO.history[i]);
  const historyRecords: HistoryModelSchema["history"] = historyRecordsDTO.map((recordDTO) => {
    let mappedRecordValue: TaskHistory["history"][number]["value"];
    let mappedRecordOldValue: TaskHistory["history"][number]["oldValue"];
    switch (recordDTO.action) {
      case "notes":
        mappedRecordValue =
          recordDTO.value == null
            ? null
            : {
                ...recordDTO.value,
                user: null,
                date: recordDTO.value.date.toDate(),
              };
        mappedRecordOldValue =
          recordDTO.oldValue == null
            ? null
            : {
                ...recordDTO.oldValue,
                user: null,
                date: recordDTO.oldValue.date.toDate(),
              };
        break;
      case "completionTime":
      case "creationTime":
      case "placingInBinTime":
        mappedRecordValue = recordDTO.value == null ? null : recordDTO.value.toDate();
        mappedRecordOldValue = recordDTO.oldValue == null ? null : recordDTO.oldValue.toDate();
        break;
      default:
        mappedRecordValue = recordDTO.value;
        mappedRecordOldValue = recordDTO.oldValue;
    }
    let mappedAction: TaskHistory["history"][number]["action"];
    switch (recordDTO.action) {
      case "assignedUserId":
        mappedAction = "assignedUser";
        break;
      case "columnId":
        mappedAction = "column";
        break;
      case "goalId":
        mappedAction = "goal";
        break;
      case "labelId":
        mappedAction = "labels";
        break;
      default:
        mappedAction = recordDTO.action;
    }
    return {
      ...recordDTO,
      action: mappedAction,
      user: null,
      date: recordDTO.date.toDate(),
      value: mappedRecordValue,
      oldValue: mappedRecordOldValue,
    };
  });
  const mappedTaskHistory: TaskHistory & Partial<Omit<TaskHistoryDTO, keyof TaskHistory>> = {
    ...taskHistoryDTO,
    history: historyRecords as TaskHistory["history"],
    modificationTime: taskHistoryDTO.modificationTime.toDate(),
    fetchingFromSeverTime: new Date(),
    hasOfflineChanges: false,
  };
  return mappedTaskHistory;
}
