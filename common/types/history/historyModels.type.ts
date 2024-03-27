import ArchivedGoals from "common/clientModels/historyModels/archivedGoals.model";
import ArchivedTasks from "common/clientModels/historyModels/archivedTasks.model";
import ColumnsHistory from "common/clientModels/historyModels/columnsHistory.model";
import GoalHistory from "common/clientModels/historyModels/goalHistory.model";
import LabelsHistory from "common/clientModels/historyModels/labelsHistory.model";
import TaskHistory from "common/clientModels/historyModels/taskHistory.model";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";

type HistoryModels = {
  ArchivedGoals: ArchivedGoals;
  ArchivedTasks: ArchivedTasks;
  ColumnsHistory: ColumnsHistory;
  GoalHistory: GoalHistory;
  LabelsHistory: LabelsHistory;
  TaskHistory: TaskHistory;
  UsersHistory: UsersHistory;
  WorkspaceHistory: WorkspaceHistory;
};

export default HistoryModels;
