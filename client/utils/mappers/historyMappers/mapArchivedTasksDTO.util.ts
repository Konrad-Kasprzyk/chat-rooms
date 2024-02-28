import ArchivedTasksDTO from "common/DTOModels/historyModels/archivedTasksDTO.model";
import ArchivedTasks from "common/clientModels/historyModels/archivedTasks.model";

export default function mapArchivedTasksDTO(archivedTasksDTO: ArchivedTasksDTO): ArchivedTasks {
  const historyRecordsDTO = [];
  for (let i = 0; i < archivedTasksDTO.historyRecordsCount; i++)
    historyRecordsDTO.push(archivedTasksDTO.history[i]);
  const mappedArchivedTasks: ArchivedTasks & Partial<Omit<ArchivedTasksDTO, keyof ArchivedTasks>> =
    {
      ...archivedTasksDTO,
      history: historyRecordsDTO.map((record) => ({
        ...record,
        user: null,
        date: record.date.toDate(),
      })),
      modificationTime: archivedTasksDTO.modificationTime.toDate(),
      fetchingFromSeverTime: new Date(),
      hasOfflineChanges: false,
    };
  return mappedArchivedTasks;
}
