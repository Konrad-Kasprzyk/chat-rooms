import Column from "common/models/workspaceModels/column.type";
import Label from "common/models/workspaceModels/label.type";
import HistoryAction from "common/types/historyAction.type";
import { Timestamp } from "firebase/firestore";

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
