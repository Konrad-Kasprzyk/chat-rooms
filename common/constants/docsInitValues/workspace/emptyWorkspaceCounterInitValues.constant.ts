import WorkspaceCounter from "common/models/utils_models/workspaceCounter.model";

const EMPTY_WORKSPACE_COUNTER_INIT_VALUES: Omit<WorkspaceCounter, "id" | "workspaceId"> = {
  nextTaskShortId: String.fromCharCode(32),
  nextTaskSearchId: 1,
  nextLabelId: String.fromCharCode(38),
  nextColumnId: String.fromCharCode(37),
  nextGoalShortId: String.fromCharCode(32),
  nextGoalSearchId: 1,
  nextNormSearchId: 1,
};

export default EMPTY_WORKSPACE_COUNTER_INIT_VALUES;
