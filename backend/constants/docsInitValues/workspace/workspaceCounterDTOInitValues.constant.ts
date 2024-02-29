import WorkspaceCounterDTO from "common/DTOModels/utilsModels/workspaceCounterDTO.model";

const WORKSPACE_COUNTER_DTO_INIT_VALUES: Omit<WorkspaceCounterDTO, "id"> = {
  nextTaskUrlNumber: 1,
  nextGoalUrlNumber: 1,
  scriptTimestamp: null,
  columnsReorganization: [],
  goalIndexesReorganizationTime: null,
};

export default WORKSPACE_COUNTER_DTO_INIT_VALUES;
