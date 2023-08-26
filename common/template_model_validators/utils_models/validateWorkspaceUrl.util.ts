import WorkspaceUrl from "common/models/utils_models/workspaceUrl.model";
import typia from "typia";

const validateWorkspaceUrl = typia.createAssertEquals<WorkspaceUrl>();

export default validateWorkspaceUrl;
