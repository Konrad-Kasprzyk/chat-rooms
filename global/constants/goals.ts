import LABEL_COLORS from "./colors";

// TODO - choose names and colors
export const INIT_GOAL_LABELS: { name: string; color: typeof LABEL_COLORS[number] }[] = [
  { name: "feature", color: "LimeGreen" },
  { name: "fix", color: "Maroon" },
  { name: "docs", color: "Goldenrod" },
  { name: "refactor", color: "LightCoral" },
  { name: "test", color: "DodgerBlue" },
  { name: "other", color: "DarkSlateGrey" },
];
