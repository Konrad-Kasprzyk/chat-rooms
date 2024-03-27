import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import typia from "typia";

const validateWorkspaceHistory = typia.createAssertEquals<WorkspaceHistory>();

export default validateWorkspaceHistory;
