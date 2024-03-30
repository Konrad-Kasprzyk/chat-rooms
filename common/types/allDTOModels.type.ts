import ChatHistoryDTO from "common/DTOModels/historyModels/chatHistoryDTO.model";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import TestCollectionsDTO from "common/DTOModels/utilsModels/testCollectionsDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";

type AllDTOModels =
  | ChatHistoryDTO
  | UsersHistoryDTO
  | WorkspaceHistoryDTO
  | TestCollectionsDTO
  | UserDetailsDTO
  | UserDTO
  | WorkspaceDTO
  | WorkspaceSummaryDTO;

export default AllDTOModels;
