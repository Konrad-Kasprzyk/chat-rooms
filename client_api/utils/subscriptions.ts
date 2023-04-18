// TODO: check if works. Maybe hold eventlisteners. add and remove for each modification with addToUnsubscribe and unsubscribeAndRemove

import { Unsubscribe } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";
import CompletedTaskStats from "../../global/models/completedTaskStats.model";
import Goal from "../../global/models/goal.model";
import Norm from "../../global/models/norm.model";
import Task from "../../global/models/task.model";
import User from "../../global/models/user.model";
import Workspace from "../../global/models/workspace.model";
import goalFilters from "../../global/types/goalFilters";
import normFilters from "../../global/types/normFilters";
import statsFilters from "../../global/types/statsFilters";
import taskFilters from "../../global/types/taskFilters";

// window.addEventListener("beforeunload", () => {
//   for (const unsubscribe of unsubscribes) {
//     unsubscribe();
//   }
// });

// Remove particular model subscriptions only when new subscriptions of that model
// are requested with different filters and total count of all model subscriptions is over 100.
let totalSubscriptionsCount = 0;

function checkAndRemoveOldestSubscriptions() {}

const TasksSubscriptions: {
  lastSubscriptionTime: Date;
  filters: taskFilters;
  subscriptions: Unsubscribe[];
  tasks: BehaviorSubject<Task[]>;
}[] = [];

// Append to stored tasks and subscriptions list with given filters
export function storeTasksSubscription(
  tasks: BehaviorSubject<Task[]>,
  subscription: Unsubscribe,
  filters: taskFilters
) {}

// Get all subscribed tasks with given filters
export function getSubscribedTasks(filters: taskFilters): BehaviorSubject<Task[]> {}

const GoalsSubscriptions: {
  lastSubscriptionTime: Date;
  filters: goalFilters;
  subscriptions: Unsubscribe[];
  goals: Goal[];
}[] = [];

// Append to stored goals and subscriptions list with given filters
export function storeGoalsSubscription(
  goals: BehaviorSubject<Goal[]>,
  subscription: Unsubscribe,
  filters: goalFilters
) {}

export function getSubscribedGoals(filters: goalFilters): BehaviorSubject<Goal[]> {}

const NormsSubscriptions: {
  lastSubscriptionTime: Date;
  filters: normFilters;
  subscriptions: Unsubscribe[];
  norms: BehaviorSubject<Norm[]>;
}[] = [];

export function storeNormsSubscription(
  norms: BehaviorSubject<Norm[]>,
  subscription: Unsubscribe,
  filters: normFilters
) {}

export function getSubscribedNorms(filters: normFilters): BehaviorSubject<Norm[]> {}

const StatsSubscriptions: {
  lastSubscriptionTime: Date;
  filters: statsFilters;
  subscriptions: Unsubscribe[];
  stats: BehaviorSubject<CompletedTaskStats[]>;
}[] = [];

export function storeStatsSubscription(
  stats: BehaviorSubject<CompletedTaskStats[]>,
  subscription: Unsubscribe,
  filters: statsFilters
) {}

export function getSubscribedStats(filters: statsFilters): BehaviorSubject<CompletedTaskStats[]> {}

const UsersSubscriptions: {
  lastSubscriptionTime: Date;
  filters: {
    workspaceId: string;
  };
  subscription: Unsubscribe;
  users: BehaviorSubject<User[]>;
}[] = [];

export function storeUsersSubscription(
  users: BehaviorSubject<User[]>,
  subscription: Unsubscribe,
  filters: {
    workspaceId: string;
  }
) {}

export function getSubscribedUsers(filters: { workspaceId: string }): BehaviorSubject<User[]> {}

const WorkspaceSubscriptions: {
  lastSubscriptionTime: Date;
  filters: {
    workspaceId: string;
  };
  subscription: Unsubscribe;
  workspace: BehaviorSubject<Workspace>;
}[] = [];

export function storeWorkspaceSubscription(
  workspace: BehaviorSubject<Workspace>,
  subscription: Unsubscribe,
  filters: {
    workspaceId: string;
  }
) {}

export function getSubscribedWorkspaces(filters: {
  workspaceId: string;
}): BehaviorSubject<Workspace> {}
