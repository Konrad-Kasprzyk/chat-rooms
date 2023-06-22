import CompletedTaskStats from "global/models/completedTaskStats.model";
import Goal from "global/models/goal.model";
import Norm from "global/models/norm.model";
import Task from "global/models/task.model";
import User from "global/models/user.model";
import Workspace from "global/models/workspace.model";
import GoalFilters from "./goalFilters";
import NormFilters from "./normFilters";
import StatsFilters from "./statsFilters";
import TaskFilters from "./taskFilters";

export const subsSubjectPackKeys = [
  "tasks",
  "goals",
  "norms",
  "stats",
  "users",
  "currentUser",
  "workspace",
] as const;

type ValidSubsSubjectPackProps = {
  [key in (typeof subsSubjectPackKeys)[number]]: object | null;
};

/**
 * These are proper filters used to obtain the documents.
 */
export interface SubsSubjectPackFilters extends ValidSubsSubjectPackProps {
  tasks: TaskFilters & { searchKeys?: boolean };
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
}

export interface SubjectModels extends ValidSubsSubjectPackProps {
  tasks: Task[];
  goals: Goal[];
  norms: Norm[];
  stats: CompletedTaskStats | null;
  users: User[];
  currentUser: User | null;
  workspace: Workspace | null;
}
