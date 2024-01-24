import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import typia from "typia";

const validateWorkspaceSummaryDTO = typia.createAssertEquals<WorkspaceSummaryDTO>();

export default validateWorkspaceSummaryDTO;
