import CompletedTaskStats from "common/models/completedTaskStats.model";
import Goal from "common/models/goal.model";
import Norm from "common/models/norm.model";
import Task from "common/models/task.model";
import User from "common/models/user.model";
import Workspace from "common/models/workspace.model";
import GoalFilters from "./goalFilters.type";
import NormFilters from "./normFilters.type";
import StatsFilters from "./statsFilters.type";
import TaskFilters from "./taskFilters.type";

const validSubsSubjectPackKeys = [
  "tasks",
  "goals",
  "norms",
  "stats",
  "users",
  "currentUser",
  "workspace",
] as const;

export type subsSubjectPackKeys = (typeof validSubsSubjectPackKeys)[number];

type ValidSubsSubjectPackProps = {
  [key in subsSubjectPackKeys]: object | null;
};

/**
 * These are proper filters used to obtain the documents.
 */
export type SubsSubjectPackFilters = ValidSubsSubjectPackProps & {
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
