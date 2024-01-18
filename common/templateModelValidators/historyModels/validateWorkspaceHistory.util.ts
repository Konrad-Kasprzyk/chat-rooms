import WorkspaceHistory from "common/models/historyModels/workspaceHistory.model";
import typia from "typia";

const validateWorkspaceHistory = typia.createAssertEquals<WorkspaceHistory>();

export default validateWorkspaceHistory;
