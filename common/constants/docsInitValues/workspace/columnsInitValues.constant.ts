import Column from "common/models/workspace_models/column.type";

const columnSkeleton = {
  replacedByColumnId: null,
  inRecycleBin: false,
  placingInBinTime: null,
  insertedIntoBinByUserId: null,
};

const COLUMNS_INIT_VALUES: Column[] = [
  { name: "backlog", taskFinishColumn: false, id: String.fromCharCode(32), ...columnSkeleton },
  { name: "to-do", taskFinishColumn: false, id: String.fromCharCode(33), ...columnSkeleton },
  { name: "in progress", taskFinishColumn: false, id: String.fromCharCode(34), ...columnSkeleton },
  { name: "review", taskFinishColumn: false, id: String.fromCharCode(35), ...columnSkeleton },
  { name: "done", taskFinishColumn: true, id: String.fromCharCode(36), ...columnSkeleton },
];

export default COLUMNS_INIT_VALUES;
