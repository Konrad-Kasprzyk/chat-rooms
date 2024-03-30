import Workspace from "common/clientModels/workspace.model";
import typia from "typia";

const validateWorkspace = typia.createAssertEquals<Workspace>();

export default validateWorkspace;
