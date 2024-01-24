import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import typia from "typia";

const validateWorkspaceSummary = typia.createAssertEquals<WorkspaceSummary>();

export default validateWorkspaceSummary;
