import Goal from "common/clientModels/goal.model";
import ArchivedGoals from "common/clientModels/historyModels/archivedGoals.model";
import ArchivedTasks from "common/clientModels/historyModels/archivedTasks.model";
import ColumnsHistory from "common/clientModels/historyModels/columnsHistory.model";
import GoalHistory from "common/clientModels/historyModels/goalHistory.model";
import LabelsHistory from "common/clientModels/historyModels/labelsHistory.model";
import TaskHistory from "common/clientModels/historyModels/taskHistory.model";
import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import Task from "common/clientModels/task.model";
import type { DBSchema } from "idb";

export default interface IDB_SCHEMA extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: {
      index: ["workspaceId", "columnId", "firstIndex", "secondIndex"];
      modificationTime: ["workspaceId", "columnId", "modificationTime"];
      columnChangeTime: ["workspaceId", "columnId", "columnChangeTime"];
      creationTime: ["workspaceId", "columnId", "creationTime"];
      placingInBinTime: ["workspaceId", "columnId", "placingInBinTime"];
    };
  };
  goals: {
    key: string;
    value: Goal;
    indexes: {
      index: ["workspaceId", "columnId", "firstIndex", "secondIndex"];
      modificationTime: ["workspaceId", "columnId", "modificationTime"];
      deadline: ["workspaceId", "columnId", "deadline"];
      creationTime: ["workspaceId", "columnId", "creationTime"];
      placingInBinTime: ["workspaceId", "columnId", "placingInBinTime"];
    };
  };
  goalArchives: {
    key: string;
    value: ArchivedGoals;
  };
  taskArchives: {
    key: string;
    value: ArchivedTasks;
  };
  columnHistories: {
    key: string;
    value: ColumnsHistory;
  };
  goalHistories: {
    key: string;
    value: GoalHistory;
  };
  labelHistories: {
    key: string;
    value: LabelsHistory;
  };
  taskHistories: {
    key: string;
    value: TaskHistory;
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
