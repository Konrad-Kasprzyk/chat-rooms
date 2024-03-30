import ChatHistory from "common/clientModels/historyModels/chatHistory.model";
import typia from "typia";

const validateChatHistory = typia.createAssertEquals<ChatHistory>();

export default validateChatHistory;
