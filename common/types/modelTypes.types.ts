import CompletedTaskStats from "common/clientModels/completedTaskStats.model";
import Goal from "common/clientModels/goal.model";
import Norm from "common/clientModels/norm.model";
import Task from "common/clientModels/task.model";
import User from "common/clientModels/user.model";
import Workspace from "common/clientModels/workspace.model";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import GoalFilters from "./filters/goalFilters.type";
import NormFilters from "./filters/normFilters.type";
import StatsFilters from "./filters/statsFilters.type";
import TaskFilters from "./filters/taskFilters.type";

export type modelDocs = {
  tasks: Task[];
  goals: Goal[];
  norms: Norm[];
  stats: CompletedTaskStats[];
  currentUser: User | null;
  users: User[];
  workspace: Workspace | null;
  workspaceSummaries: WorkspaceSummary[];
};

export type modelFilters = {
  tasks: TaskFilters;
  goals: GoalFilters;
  norms: NormFilters;
  stats: StatsFilters;
  currentUser: null;
  users: null;
  workspace: null;
  workspaceSummaries: null;
};

export type cacheableModelDocs = Omit<modelDocs, "currentUser" | "workspace">;
export type cacheableModelFilters = Omit<modelFilters, "currentUser" | "workspace">;
