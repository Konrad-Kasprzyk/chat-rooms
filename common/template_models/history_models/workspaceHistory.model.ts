import Column from "common/models/workspace_models/column.type";
import Label from "common/models/workspace_models/label.type";
import HistoryAction from "common/types/historyAction.type";
import { Timestamp } from "firebase/firestore";
import typia from "typia";

export default interface WorkspaceHistory {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * @minLength 1
   */
  previousHistoryId: string | null;
  history: (
    | HistoryAction<"title" | "description", string>
    | HistoryAction<"userIds" | "invitedUserIds", string[]>
    | HistoryAction<"columns", Column>
    | HistoryAction<"labels", Label>
    | HistoryAction<"placingInBinTime", Timestamp>
  )[];
  /**
   * @minLength 1
   */
  workspaceId: string | null;
}

export const validateWorkspaceHistory = typia.createValidateEquals<WorkspaceHistory>();
