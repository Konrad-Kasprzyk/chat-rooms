import ChatHistory from "common/clientModels/historyModels/chatHistory.model";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import type { DBSchema } from "idb";

export default interface IDBSchema extends DBSchema {
  chatHistories: {
    key: string;
    value: ChatHistory;
  };
  userHistories: {
    key: string;
    value: UsersHistory;
  };
  workspaceHistories: {
    key: string;
    value: WorkspaceHistory;
  };
}
