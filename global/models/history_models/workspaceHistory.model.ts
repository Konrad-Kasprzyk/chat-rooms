import { Timestamp } from "firebase/firestore";
import Column from "global/types/column";
import HistoryAction from "global/types/historyAction";
import Label from "global/types/label";

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
