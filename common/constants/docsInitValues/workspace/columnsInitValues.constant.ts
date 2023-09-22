import Column from "common/models/workspace_models/column.type";

const columnSkeleton = {
  replacedByColumnId: null,
  isInBin: false,
  placingInBinTime: null,
  insertedIntoBinByUserId: null,
};

const COLUMNS_INIT_VALUES: Column[] = [
  { id: "1", name: "backlog", completedTasksColumn: false, ...columnSkeleton },
  { id: "2", name: "to-do", completedTasksColumn: false, ...columnSkeleton },
  { id: "3", name: "in progress", completedTasksColumn: false, ...columnSkeleton },
  { id: "4", name: "review", completedTasksColumn: false, ...columnSkeleton },
  { id: "5", name: "done", completedTasksColumn: true, ...columnSkeleton },
];

export default COLUMNS_INIT_VALUES;
