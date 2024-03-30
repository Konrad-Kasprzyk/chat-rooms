import ChatHistoryDTO from "common/DTOModels/historyModels/chatHistoryDTO.model";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";

type HistoryModelsDTO = ChatHistoryDTO | UsersHistoryDTO | WorkspaceHistoryDTO;

export default HistoryModelsDTO;
