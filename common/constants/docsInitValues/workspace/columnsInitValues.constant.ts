import Column from "common/models/workspace_models/column.type";

const COLUMNS_INIT_VALUES: Column[] = [
  { id: "1", name: "backlog", completedTasksColumn: false },
  { id: "2", name: "to-do", completedTasksColumn: false },
  { id: "3", name: "in progress", completedTasksColumn: false },
  { id: "4", name: "review", completedTasksColumn: false },
  { id: "5", name: "done", completedTasksColumn: true },
];

export default COLUMNS_INIT_VALUES;
