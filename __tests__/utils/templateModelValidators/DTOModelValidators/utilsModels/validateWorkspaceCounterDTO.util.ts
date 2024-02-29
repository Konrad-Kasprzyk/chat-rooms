import WorkspaceCounterDTO from "common/DTOModels/utilsModels/workspaceCounterDTO.model";
import typia from "typia";

const validateWorkspaceCounterDTO = typia.createAssertEquals<WorkspaceCounterDTO>();

export default validateWorkspaceCounterDTO;
