import GoalHistoryDTO from "common/DTOModels/historyModels/goalHistoryDTO.model";
import GoalHistory from "common/clientModels/historyModels/goalHistory.model";
import HistoryModelSchema from "common/clientModels/historyModels/historyModelSchema.interface";

export default function mapGoalHistoryDTO(goalHistoryDTO: GoalHistoryDTO): GoalHistory {
  const historyRecordsDTO = [];
  for (let i = 0; i < goalHistoryDTO.historyRecordsCount; i++)
    historyRecordsDTO.push(goalHistoryDTO.history[i]);
  const historyRecords: HistoryModelSchema["history"] = historyRecordsDTO.map((recordDTO) => {
    let mappedRecordValue: GoalHistory["history"][number]["value"];
    let mappedRecordOldValue: GoalHistory["history"][number]["oldValue"];
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
      case "deadline":
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
  const mappedGoalHistory: GoalHistory & Partial<Omit<GoalHistoryDTO, keyof GoalHistory>> = {
    ...goalHistoryDTO,
    history: historyRecords as GoalHistory["history"],
    modificationTime: goalHistoryDTO.modificationTime.toDate(),
    fetchingFromSeverTime: new Date(),
    hasOfflineChanges: false,
  };
  return mappedGoalHistory;
}
