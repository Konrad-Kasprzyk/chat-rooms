import Column from "common/types/column.type";

const COLUMNS_INIT_VALUES: Column[] = [
  { id: "1", name: "backlog", completedTasksColumn: false, replacedColumnIds: [] },
  { id: "2", name: "to-do", completedTasksColumn: false, replacedColumnIds: [] },
  { id: "3", name: "in progress", completedTasksColumn: false, replacedColumnIds: [] },
  { id: "4", name: "review", completedTasksColumn: false, replacedColumnIds: [] },
  { id: "5", name: "done", completedTasksColumn: true, replacedColumnIds: [] },
];

export default COLUMNS_INIT_VALUES;
