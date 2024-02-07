import GoalDTO from "common/DTOModels/goalDTO.model";
import ArchivedGoalsDTO from "common/DTOModels/historyModels/archivedGoalsDTO.model";
import ArchivedTasksDTO from "common/DTOModels/historyModels/archivedTasksDTO.model";
import GoalHistoryDTO from "common/DTOModels/historyModels/goalHistoryDTO.model";
import TaskHistoryDTO from "common/DTOModels/historyModels/taskHistoryDTO.model";
import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";
import TaskDTO from "common/DTOModels/taskDTO.model";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import TestCollectionsDTO from "common/DTOModels/utilsModels/testCollectionsDTO.model";
import WorkspaceCounterDTO from "common/DTOModels/utilsModels/workspaceCounterDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";

type AllDTOModels =
  | ArchivedGoalsDTO
  | ArchivedTasksDTO
  | GoalHistoryDTO
  | TaskHistoryDTO
  | WorkspaceHistoryDTO
  | TestCollectionsDTO
  | WorkspaceCounterDTO
  | GoalDTO
  | TaskDTO
  | UserDetailsDTO
  | UserDTO
  | WorkspaceDTO
  | WorkspaceSummaryDTO;

export default AllDTOModels;
