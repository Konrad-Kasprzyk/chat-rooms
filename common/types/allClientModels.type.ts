import Goal from "common/clientModels/goal.model";
import ArchivedGoals from "common/clientModels/historyModels/archivedGoals.model";
import ArchivedTasks from "common/clientModels/historyModels/archivedTasks.model";
import GoalHistory from "common/clientModels/historyModels/goalHistory.model";
import TaskHistory from "common/clientModels/historyModels/taskHistory.model";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import Task from "common/clientModels/task.model";
import User from "common/clientModels/user.model";
import UserDetails from "common/clientModels/userDetails.model";
import Workspace from "common/clientModels/workspace.model";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";

type AllClientModels =
  | ArchivedGoals
  | ArchivedTasks
  | GoalHistory
  | TaskHistory
  | WorkspaceHistory
  | Goal
  | Task
  | User
  | UserDetails
  | Workspace
  | WorkspaceSummary;

export default AllClientModels;
