/* This code exports constants that are used for initializing a workspace
 and the workspace counter for generating unique IDs for tasks, goals, columns, etc. */
import LABEL_COLORS from "./colors";

export const INIT_TASK_COLUMNS = ["backlog", "to-do", "in progress", "review", "done"];
export const INIT_TASK_LABELS: { name: string; color: (typeof LABEL_COLORS)[number] }[] = [
  { name: "feature", color: "LimeGreen" },
  { name: "fix", color: "Maroon" },
  { name: "docs", color: "Goldenrod" },
  { name: "refactor", color: "LightCoral" },
  { name: "test", color: "DodgerBlue" },
  { name: "other", color: "DarkSlateGrey" },
];

export const INIT_COUNTER_TASK_SEARCH_ID = 1;
export const INIT_COUNTER_TASK_SHORT_ID = " ";
export const INIT_COUNTER_LABEL_ID = "&";
export const INIT_COUNTER_COLUMN_ID = "%";
export const INIT_COUNTER_GOAL_SEARCH_ID = 1;
export const INIT_COUNTER_GOAL_SHORT_ID = " ";
export const INIT_COUNTER_NORM_SEARCH_ID = 1;
