import WorkspaceCounter from "common/models/workspace_models/workspaceCounter.model";
import typia from "typia";

const validateWorkspaceCounter = typia.createAssertEquals<WorkspaceCounter>();

export default validateWorkspaceCounter;
