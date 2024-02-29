import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";
import typia from "typia";

const validateWorkspaceHistoryDTO = typia.createAssertEquals<WorkspaceHistoryDTO>();

export default validateWorkspaceHistoryDTO;
