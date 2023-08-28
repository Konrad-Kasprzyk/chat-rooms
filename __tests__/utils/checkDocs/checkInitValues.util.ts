import USER_INIT_VALUES from "common/constants/docsInitValues/userInitValues.constant";
import EMPTY_WORKSPACE_COUNTER_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceCounterInitValues.constant";
import EMPTY_WORKSPACE_INIT_VALUES from "common/constants/docsInitValues/workspace/emptyWorkspaceInitValues.constant";
import WORKSPACE_SUMMARY_INIT_VALUES from "common/constants/docsInitValues/workspace/workspaceSummaryInitValues.constant";
import User from "common/models/user.model";
import WorkspaceCounter from "common/models/utils_models/workspaceCounter.model";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import { Timestamp } from "firebase/firestore";

type validDocsInitValues = {
  user: [User, typeof USER_INIT_VALUES];
  workspace: [Workspace, typeof EMPTY_WORKSPACE_INIT_VALUES];
  workspaceSummary: [WorkspaceSummary, typeof WORKSPACE_SUMMARY_INIT_VALUES];
  workspaceCounter: [WorkspaceCounter, typeof EMPTY_WORKSPACE_COUNTER_INIT_VALUES];
};

export default function checkInitValues<K extends keyof validDocsInitValues>(
  ...args: validDocsInitValues[K]
): void {
  const docToCheck = args[0];
  const initValues = args[1];
  // Assert that all dates were created at the same time.
  let dateFromServer: Timestamp | undefined = undefined;
  for (const key of Object.keys(initValues) as (keyof typeof initValues)[]) {
    if ((docToCheck[key] as any) instanceof Timestamp) {
      const dateToCheck = docToCheck[key] as Timestamp;
      expect(dateToCheck).toBeInstanceOf(Timestamp);
      if (dateFromServer) expect(dateToCheck.toString()).toStrictEqual(dateFromServer.toString());
      else dateFromServer = dateToCheck;
    } else expect(docToCheck[key]).toStrictEqual(initValues[key]);
  }
}
