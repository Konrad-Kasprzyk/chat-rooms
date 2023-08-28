import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import typia from "typia";

const validateWorkspaceSummary = typia.createAssertEquals<WorkspaceSummary>();

export default validateWorkspaceSummary;
