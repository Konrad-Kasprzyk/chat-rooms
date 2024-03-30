import ChatHistoryDTO from "common/DTOModels/historyModels/chatHistoryDTO.model";
import typia from "typia";

const validateChatHistoryDTO = typia.createAssertEquals<ChatHistoryDTO>();

export default validateChatHistoryDTO;
