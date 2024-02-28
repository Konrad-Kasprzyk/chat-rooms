import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import HistoryModelSchema from "common/clientModels/historyModels/historyModelSchema.interface";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";

export default function mapUsersHistoryDTO(usersHistoryDTO: UsersHistoryDTO): UsersHistory {
  const historyRecordsDTO = [];
  for (let i = 0; i < usersHistoryDTO.historyRecordsCount; i++)
    historyRecordsDTO.push(usersHistoryDTO.history[i]);
  const historyRecords: HistoryModelSchema["history"] = historyRecordsDTO.map((recordDTO) => {
    let mappedAction: UsersHistory["history"][number]["action"];
    switch (recordDTO.action) {
      case "userIds":
        mappedAction = "users";
        break;
      default:
        mappedAction = recordDTO.action;
    }
    return {
      ...recordDTO,
      action: mappedAction,
      user: null,
      date: recordDTO.date.toDate(),
    };
  });
  const mappedUsersHistory: UsersHistory & Partial<Omit<UsersHistoryDTO, keyof UsersHistory>> = {
    ...usersHistoryDTO,
    history: historyRecords as UsersHistory["history"],
    modificationTime: usersHistoryDTO.modificationTime.toDate(),
  };
  return mappedUsersHistory;
}
