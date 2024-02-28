import ArchivedGoalsDTO from "common/DTOModels/historyModels/archivedGoalsDTO.model";
import ArchivedTasksDTO from "common/DTOModels/historyModels/archivedTasksDTO.model";
import ColumnsHistoryDTO from "common/DTOModels/historyModels/columnsHistoryDTO.model";
import GoalHistoryDTO from "common/DTOModels/historyModels/goalHistoryDTO.model";
import LabelsHistoryDTO from "common/DTOModels/historyModels/labelsHistoryDTO.model";
import TaskHistoryDTO from "common/DTOModels/historyModels/taskHistoryDTO.model";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";

type HistoryModelsDTO =
  | ArchivedGoalsDTO
  | ArchivedTasksDTO
  | ColumnsHistoryDTO
  | GoalHistoryDTO
  | LabelsHistoryDTO
  | TaskHistoryDTO
  | UsersHistoryDTO
  | WorkspaceHistoryDTO;

export default HistoryModelsDTO;
