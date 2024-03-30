import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import typia from "typia";

const validateWorkspaceDTO = typia.createAssertEquals<WorkspaceDTO>();

export default validateWorkspaceDTO;
