import USER_DETAILS_INIT_VALUES from "common/constants/docsInitValues/userDetailsInitValues.constant";
import USER_INIT_VALUES from "common/constants/docsInitValues/userInitValues.constant";
import WORKSPACE_COUNTER_INIT_VALUES from "common/constants/docsInitValues/workspace/workspaceCounterInitValues.constant";
import WORKSPACE_INIT_VALUES from "common/constants/docsInitValues/workspace/workspaceInitValues.constant";
import WORKSPACE_SUMMARY_INIT_VALUES from "common/constants/docsInitValues/workspace/workspaceSummaryInitValues.constant";
import User from "common/models/user.model";
import UserDetails from "common/models/userDetails.model";
import Workspace from "common/models/workspaceModels/workspace.model";
import WorkspaceCounter from "common/models/workspaceModels/workspaceCounter.model";
import WorkspaceSummary from "common/models/workspaceModels/workspaceSummary.model";
import { Timestamp as adminTimestamp } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

type validDocsInitValues = {
  user: [User, typeof USER_INIT_VALUES];
  userDetails: [UserDetails, typeof USER_DETAILS_INIT_VALUES];
  workspace: [Workspace, typeof WORKSPACE_INIT_VALUES];
  workspaceCounter: [WorkspaceCounter, typeof WORKSPACE_COUNTER_INIT_VALUES];
  workspaceSummary: [WorkspaceSummary, typeof WORKSPACE_SUMMARY_INIT_VALUES];
};

/**
 * Ensures that the specified document fields are equal to the specified initial document values.
 * Ensures that all dates were created at the same time.
 */
export default function checkInitValues<K extends keyof validDocsInitValues>(
  ...args: validDocsInitValues[K]
): void {
  const docToCheck = args[0];
  const initValues = args[1];
  // Assert that all dates were created at the same time.
  let dateFromServer: Timestamp | undefined = undefined;
  for (const key of Object.keys(initValues)) {
    const valueToCheck = (docToCheck as { [key in string]: any })[key];
    const initValue = (initValues as { [key in string]: any })[key];
    if (valueToCheck instanceof Timestamp || valueToCheck instanceof adminTimestamp) {
      const dateToCheck = valueToCheck as Timestamp;
      if (dateFromServer) expect(dateToCheck.toString()).toStrictEqual(dateFromServer.toString());
      else dateFromServer = dateToCheck;
    } else expect(valueToCheck).toStrictEqual(initValue);
  }
}
