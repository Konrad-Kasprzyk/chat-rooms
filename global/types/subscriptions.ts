import CompletedTaskStats from "../models/completedTaskStats.model";
import Goal from "../models/goal.model";
import Norm from "../models/norm.model";
import Task from "../models/task.model";
import User from "../models/user.model";
import Workspace from "../models/workspace.model";
import goalFilters from "./goalFilters";
import normFilters from "./normFilters";
import statsFilters from "./statsFilters";
import taskFilters from "./taskFilters";

export const subscriptionKeys = [
  "tasks",
  "goals",
  "norms",
  "stats",
  "users",
  "currentUser",
  "workspace",
] as const;

type validSubscriptionKeys = {
  [key in (typeof subscriptionKeys)[number]]: object;
};

/**
 * These are proper filters used to obtain the documents.
 */
export interface subscriptionFilters extends validSubscriptionKeys {
  tasks: taskFilters;
  goals: goalFilters;
  norms: normFilters;
  stats: statsFilters;
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

export interface subscriptionModels extends validSubscriptionKeys {
  tasks: Task[];
  goals: Goal[];
  norms: Norm[];
  stats: CompletedTaskStats;
  users: User[];
  currentUser: User;
  workspace: Workspace;
}
