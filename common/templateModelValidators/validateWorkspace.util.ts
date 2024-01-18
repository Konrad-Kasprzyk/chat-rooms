import MIN_COLUMN_COUNT from "common/constants/minColumnCount.constant";
import Workspace from "common/models/workspaceModels/workspace.model";
import typia from "typia";

/**
 * Assert that hardcoded '@minItems 2' used in columns property of Workspace model is valid.
 * Used number '2' should equal MIN_COLUMN_COUNT constant.
 */
typia.assert<{ MIN_COLUMN_COUNT: 2 }>({ MIN_COLUMN_COUNT });

const validateWorkspace = typia.createAssertEquals<Workspace>();

export default validateWorkspace;
