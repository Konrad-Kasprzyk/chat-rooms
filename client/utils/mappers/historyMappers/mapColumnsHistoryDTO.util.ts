import ColumnsHistoryDTO from "common/DTOModels/historyModels/columnsHistoryDTO.model";
import ColumnsHistory from "common/clientModels/historyModels/columnsHistory.model";

export default function mapColumnsHistoryDTO(columnsHistoryDTO: ColumnsHistoryDTO): ColumnsHistory {
  const historyRecordsDTO = [];
  for (let i = 0; i < columnsHistoryDTO.historyRecordsCount; i++)
    historyRecordsDTO.push(columnsHistoryDTO.history[i]);
  const mappedColumnsHistory: ColumnsHistory &
    Partial<Omit<ColumnsHistoryDTO, keyof ColumnsHistory>> = {
    ...columnsHistoryDTO,
    history: historyRecordsDTO.map((record) => ({
      ...record,
      user: null,
      date: record.date.toDate(),
    })),
    modificationTime: columnsHistoryDTO.modificationTime.toDate(),
  };
  return mappedColumnsHistory;
}
