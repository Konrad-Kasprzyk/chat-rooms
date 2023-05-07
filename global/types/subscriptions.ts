import CompletedTaskStats from "../models/completedTaskStats.model";
import Goal from "../models/goal.model";
import Norm from "../models/norm.model";
import Task from "../models/task.model";
import User from "../models/user.model";
import Workspace from "../models/workspace.model";
import GoalFilters from "./goalFilters";
import NormFilters from "./normFilters";
import StatsFilters from "./statsFilters";
import TaskFilters from "./taskFilters";

export const subscriptionKeys = [
  "tasks",
  "goals",
  "norms",
  "stats",
  "users",
  "currentUser",
  "workspace",
] as const;

type ValidSubscriptionKeys = {
  [key in (typeof subscriptionKeys)[number]]: object | null;
};

/**
 * These are proper filters used to obtain the documents.
 */
export interface SubscriptionFilters extends ValidSubscriptionKeys {
  tasks: TaskFilters;
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

export interface SubscriptionModels extends ValidSubscriptionKeys {
  tasks: Task[];
  goals: Goal[];
  norms: Norm[];
  stats: CompletedTaskStats | null;
  users: User[];
  currentUser: User | null;
  workspace: Workspace | null;
}
