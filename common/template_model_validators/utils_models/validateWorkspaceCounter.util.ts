import WorkspaceCounter from "common/models/utils_models/workspaceCounter.model";
import typia from "typia";

const validateWorkspaceCounter = typia.createAssertEquals<WorkspaceCounter>();

export default validateWorkspaceCounter;
