/* This code exports constants that are used for initializing a workspace
 and the workspace counter for generating unique IDs for tasks, goals, columns, etc. */
import Column from "global/types/column";
import Label from "global/types/label";

const columnSchema = {
  replacedByColumnId: null,
  inRecycleBin: false,
  placingInBinTime: null,
  insertedIntoBinByUserId: null,
};

export const INIT_TASK_COLUMNS: Column[] = [
  { name: "backlog", taskFinishColumn: false, id: String.fromCharCode(32), ...columnSchema },
  { name: "to-do", taskFinishColumn: false, id: String.fromCharCode(33), ...columnSchema },
  { name: "in progress", taskFinishColumn: false, id: String.fromCharCode(34), ...columnSchema },
  { name: "review", taskFinishColumn: false, id: String.fromCharCode(35), ...columnSchema },
  { name: "done", taskFinishColumn: true, id: String.fromCharCode(36), ...columnSchema },
];

const labelSchema = {
  replacedByLabelId: null,
  inRecycleBin: false,
  placingInBinTime: null,
  insertedIntoBinByUserId: null,
};

export const INIT_TASK_LABELS: Label[] = [
  { name: "feature", color: "LimeGreen", id: String.fromCharCode(32), ...labelSchema },
  { name: "fix", color: "Maroon", id: String.fromCharCode(33), ...labelSchema },
  { name: "docs", color: "Goldenrod", id: String.fromCharCode(34), ...labelSchema },
  { name: "refactor", color: "LightCoral", id: String.fromCharCode(35), ...labelSchema },
  { name: "test", color: "DodgerBlue", id: String.fromCharCode(36), ...labelSchema },
  { name: "other", color: "DarkSlateGrey", id: String.fromCharCode(37), ...labelSchema },
];

export const INIT_COUNTER_TASK_SEARCH_ID = 1;
export const INIT_COUNTER_TASK_SHORT_ID = String.fromCharCode(32);
export const INIT_COUNTER_LABEL_ID = String.fromCharCode(38);
export const INIT_COUNTER_COLUMN_ID = String.fromCharCode(37);
export const INIT_COUNTER_GOAL_SEARCH_ID = 1;
export const INIT_COUNTER_GOAL_SHORT_ID = String.fromCharCode(32);
export const INIT_COUNTER_NORM_SEARCH_ID = 1;
