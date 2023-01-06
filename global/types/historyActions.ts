import { Timestamp } from "firebase/firestore";

type historyAction<T> = {
  action: string;
  userId: string;
  date: Timestamp;
  oldValue: T;
  newValue: T;
};

// subtasks index and other index holds replaced texts
// instead of 1 <-> 3 holds subtasks[1] <-> subtasks[3]

export type taskHistoryActions = [
  { action: "title" } & historyAction<string>,
  { action: "description" } & historyAction<string>,
  { action: "type" } & historyAction<string>,
  { action: "status" } & historyAction<string>,
  { action: "subTasks" } & historyAction<string>,
  { action: "subTasks index" } & historyAction<string>,
  { action: "createdTime" } & historyAction<Timestamp>,
  { action: "activatedTime" } & historyAction<Timestamp>,
  { action: "finishedTime" } & historyAction<Timestamp>,
  { action: "storyPoints" } & historyAction<number>,
  { action: "assignedUserId" } & historyAction<string>,
  { action: "notes" } & historyAction<string>,
  { action: "notes index" } & historyAction<string>,
  { action: "goalId" } & historyAction<string>
];

export type goalHistoryActions = [
  { action: "title" } & historyAction<string>,
  { action: "description" } & historyAction<string>,
  { action: "subGoals" } & historyAction<string>,
  { action: "subGoals index" } & historyAction<string>,
  { action: "createdTime" } & historyAction<Timestamp>,
  { action: "activatedTime" } & historyAction<Timestamp>,
  { action: "finishedTime" } & historyAction<Timestamp>,
  { action: "storyPoints" } & historyAction<number>,
  { action: "notes" } & historyAction<string>,
  { action: "notes index" } & historyAction<string>
];

export type projectHistoryActions = [
  { action: "title" } & historyAction<string>,
  { action: "description" } & historyAction<string>,
  { action: "users"; userId: string } & historyAction<string>,
  { action: "permittedTeamsIds" } & historyAction<string>,
  { action: "visible" } & historyAction<boolean>,
  { action: "taskStatuses" } & historyAction<string>,
  { action: "taskStatuses index" } & historyAction<string>,
  { action: "taskTypes" } & historyAction<string>,
  { action: "taskTypes color"; type: string } & historyAction<string>,
  { action: "taskTypes index" } & historyAction<string>
];

export type normHistoryActions = [
  { action: "title" } & historyAction<string>,
  { action: "description" } & historyAction<string>,
  { action: "startDay" } & historyAction<Timestamp>,
  { action: "endDay" } & historyAction<Timestamp>,
  { action: "plannedStoryPoints" } & historyAction<number>
];

export type teamHistoryActions = [
  { action: "title" } & historyAction<string>,
  { action: "description" } & historyAction<string>,
  { action: "users"; userId: string } & historyAction<string>,
  { action: "teamProjectsIds" } & historyAction<string>,
  { action: "visible" } & historyAction<boolean>
];
