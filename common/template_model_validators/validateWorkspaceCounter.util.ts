import WorkspaceCounter from "common/models/workspace_models/workspaceCounter.model";
import typia from "typia";

const validateWorkspaceCounter = typia.createValidateEquals<WorkspaceCounter>();

export default validateWorkspaceCounter;
