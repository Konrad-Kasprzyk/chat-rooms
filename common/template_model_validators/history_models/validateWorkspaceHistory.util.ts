import WorkspaceHistory from "common/models/history_models/workspaceHistory.model";
import typia from "typia";

const validateWorkspaceHistory = typia.createAssertEquals<WorkspaceHistory>();

export default validateWorkspaceHistory;
