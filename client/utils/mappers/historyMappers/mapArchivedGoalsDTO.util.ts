import ArchivedGoalsDTO from "common/DTOModels/historyModels/archivedGoalsDTO.model";
import ArchivedGoals from "common/clientModels/historyModels/archivedGoals.model";

export default function mapArchivedGoalsDTO(archivedGoalsDTO: ArchivedGoalsDTO): ArchivedGoals {
  const historyRecordsDTO = [];
  for (let i = 0; i < archivedGoalsDTO.historyRecordsCount; i++)
    historyRecordsDTO.push(archivedGoalsDTO.history[i]);
  const mappedArchivedGoals: ArchivedGoals & Partial<Omit<ArchivedGoalsDTO, keyof ArchivedGoals>> =
    {
      ...archivedGoalsDTO,
      history: historyRecordsDTO.map((record) => ({
        ...record,
        user: null,
        date: record.date.toDate(),
      })),
      modificationTime: archivedGoalsDTO.modificationTime.toDate(),
      fetchingFromSeverTime: new Date(),
      hasOfflineChanges: false,
    };
  return mappedArchivedGoals;
}
