// Minimum 2 statuses - first for newly created tasks, second for completed tasks.
export const MIN_TASK_STATUSES_COUNT = 2;
// Firestore limitation, can do only 10 'or' logical clauses in one query.
export const MAX_TASK_STATUSES_COUNT = 10;

export const INIT_TASK_STATUSES = ["To-do", "In progress", "Review", "Done"];
export const INIT_TASK_TYPES: { type: string; color: typeof TASK_TYPES_COLORS[number] }[] = [
  { type: "feature", color: "LimeGreen" },
  { type: "fix", color: "Maroon" },
  { type: "docs", color: "Goldenrod" },
  { type: "refactor", color: "LightCoral" },
  { type: "test", color: "DodgerBlue" },
  { type: "other", color: "DarkSlateGrey" },
];
export const TASK_TYPES_COLORS = [
  "DarkRed",
  "Crimson",
  "LightCoral",
  "LightSalmon",
  "DeepPink",
  "HotPink",
  "Coral",
  "OrangeRed",
  "Yellow",
  "BlueViolet",
  "Purple",
  "Indigo",
  "RosyBrown",
  "GreenYellow",
  "LimeGreen",
  "SeaGreen",
  "Green",
  "DarkCyan",
  "Cyan",
  "DodgerBlue",
  "Blue",
  "Snow",
  "DarkGrey",
  "Grey",
  "DarkSlateGrey",
  "Goldenrod",
  "Chocolate",
  "Brown",
  "Maroon",
] as const;
