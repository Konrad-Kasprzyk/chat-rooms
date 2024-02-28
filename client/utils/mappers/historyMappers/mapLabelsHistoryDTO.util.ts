import LabelsHistoryDTO from "common/DTOModels/historyModels/labelsHistoryDTO.model";
import LabelsHistory from "common/clientModels/historyModels/labelsHistory.model";

export default function mapLabelsHistoryDTO(labelsHistoryDTO: LabelsHistoryDTO): LabelsHistory {
  const historyRecordsDTO = [];
  for (let i = 0; i < labelsHistoryDTO.historyRecordsCount; i++)
    historyRecordsDTO.push(labelsHistoryDTO.history[i]);
  const mappedLabelsHistory: LabelsHistory & Partial<Omit<LabelsHistoryDTO, keyof LabelsHistory>> =
    {
      ...labelsHistoryDTO,
      history: historyRecordsDTO.map((record) => ({
        ...record,
        user: null,
        date: record.date.toDate(),
      })),
      modificationTime: labelsHistoryDTO.modificationTime.toDate(),
    };
  return mappedLabelsHistory;
}
