import WorkspaceSummary from "common/models/workspaceModels/workspaceSummary.model";
import typia from "typia";

const validateWorkspaceSummary = typia.createAssertEquals<WorkspaceSummary>();

export default validateWorkspaceSummary;
