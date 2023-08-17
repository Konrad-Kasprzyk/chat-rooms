import WorkspaceHistory from "common/models/history_models/workspaceHistory.model";
import typia from "typia";

const validateWorkspaceHistory = typia.createValidateEquals<WorkspaceHistory>();

export default validateWorkspaceHistory;
