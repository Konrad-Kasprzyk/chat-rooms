import WorkspaceCounter from "common/models/workspaceModels/workspaceCounter.model";

const EMPTY_WORKSPACE_COUNTER_INIT_VALUES: Omit<WorkspaceCounter, "id"> = {
  nextTaskId: 1,
  nextGoalId: 1,
  nextLabelId: 7,
  nextColumnId: 6,
  nextNormId: 1,
};

export default EMPTY_WORKSPACE_COUNTER_INIT_VALUES;
