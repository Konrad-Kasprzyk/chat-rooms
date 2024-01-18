import WorkspaceCounter from "common/models/workspaceModels/workspaceCounter.model";
import typia from "typia";

const validateWorkspaceCounter = typia.createAssertEquals<WorkspaceCounter>();

export default validateWorkspaceCounter;
