import ChatHistoryDTO from "common/DTOModels/historyModels/chatHistoryDTO.model";
import ChatHistory from "common/clientModels/historyModels/chatHistory.model";
import HistoryModelSchema from "common/clientModels/historyModels/historyModelSchema.interface";

export default function mapChatHistoryDTO(chatHistoryDTO: ChatHistoryDTO): ChatHistory {
  const historyRecordsDTO = [];
  for (let i = 0; i < chatHistoryDTO.historyRecordsCount; i++)
    historyRecordsDTO.push(chatHistoryDTO.history[i]);
  const historyRecords: HistoryModelSchema["history"] = historyRecordsDTO.map((recordDTO) => ({
    ...recordDTO,
    user: null,
    date: recordDTO.date.toDate(),
  }));
  const mappedChatHistory: ChatHistory & Partial<Omit<ChatHistoryDTO, keyof ChatHistory>> = {
    ...chatHistoryDTO,
    history: historyRecords as ChatHistory["history"],
    modificationTime: chatHistoryDTO.modificationTime.toDate(),
  };
  return mappedChatHistory;
}
