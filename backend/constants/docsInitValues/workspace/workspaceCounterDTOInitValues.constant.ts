import WorkspaceCounterDTO from "common/DTOModels/utilsModels/workspaceCounterDTO.model";

const WORKSPACE_COUNTER_DTO_INIT_VALUES: Omit<WorkspaceCounterDTO, "id"> = {
  nextTaskId: 1,
  nextGoalId: 1,
  nextLabelId: 7,
  nextColumnId: 6,
  nextNormId: 1,
};

export default WORKSPACE_COUNTER_DTO_INIT_VALUES;
