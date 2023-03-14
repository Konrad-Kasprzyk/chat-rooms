import LABEL_COLORS from "./colors";

// Minimum 2 columns - it does not make sense otherwise
export const MIN_TASK_COLUMN_COUNT = 2;

export const INIT_TASK_COLUMNS = ["backlog", "to-do", "in progress", "review", "done"];
export const INIT_TASK_LABELS: { name: string; color: typeof LABEL_COLORS[number] }[] = [
  { name: "feature", color: "LimeGreen" },
  { name: "fix", color: "Maroon" },
  { name: "docs", color: "Goldenrod" },
  { name: "refactor", color: "LightCoral" },
  { name: "test", color: "DodgerBlue" },
  { name: "other", color: "DarkSlateGrey" },
];
