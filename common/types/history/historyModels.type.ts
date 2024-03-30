import ChatHistory from "common/clientModels/historyModels/chatHistory.model";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";

type HistoryModels = {
  ChatHistory: ChatHistory;
  UsersHistory: UsersHistory;
  WorkspaceHistory: WorkspaceHistory;
};

export default HistoryModels;
