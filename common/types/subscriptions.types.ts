import CompletedTaskStats from "common/models/completedTaskStats.model";
import Goal from "common/models/goal.model";
import Norm from "common/models/norm.model";
import Task from "common/models/task.model";
import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import GoalFilters from "./filters/goalFilters.type";
import NormFilters from "./filters/normFilters.type";
import StatsFilters from "./filters/statsFilters.type";
import TaskFilters from "./filters/taskFilters.type";

export type validModelsKeys =
  | "tasks"
  | "goals"
  | "norms"
  | "stats"
  | "users"
  | "currentUser"
  | "workspace";

type ValidSubsSubjectPackProps = {
  [key in validModelsKeys]: object | null;
};

/**
 * These are proper filters used to obtain the documents.
 */
export type SubsSubjectPackFilters = ValidSubsSubjectPackProps & {
  tasks: TaskFilters & { hasSearchKeys?: boolean };
  goals: GoalFilters;
  norms: NormFilters;
  stats: StatsFilters;
  users: {
    workspaceId: string;
  };
  currentUser: {
    uid: string;
  };
  workspace: {
    workspaceId: string;
  };
};

export type SubjectModels = ValidSubsSubjectPackProps & {
  tasks: Task[];
  goals: Goal[];
  norms: Norm[];
  stats: CompletedTaskStats | null;
  users: User[];
  currentUser: User | null;
  workspace: Workspace | null;
};
