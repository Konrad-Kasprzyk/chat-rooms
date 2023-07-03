import Column from "common/types/column";
import HistoryAction from "common/types/historyAction";
import Label from "common/types/label";
import { Timestamp } from "firebase/firestore";

export default interface WorkspaceHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | HistoryAction<"title" | "description", string>
    | HistoryAction<"userIds" | "invitedUserIds", string[]>
    | HistoryAction<"columns", Column>
    | HistoryAction<"labels", Label>
    | HistoryAction<"placingInBinTime", Timestamp>
  )[];
  workspaceId: string | null;
}
