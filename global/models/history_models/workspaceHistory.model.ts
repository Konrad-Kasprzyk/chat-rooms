import { Timestamp } from "firebase/firestore";
import LABEL_COLORS from "../../constants/colors";
import HistoryAction from "../../types/historyAction";

export default interface WorkspaceHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | HistoryAction<"title" | "description", string>
    | HistoryAction<"userIds" | "invitedUserIds", string[]>
    | HistoryAction<
        "columns",
        {
          name: string;
          taskFinishColumn: boolean;
          id: string;
          replacedByColumnId: string | null;
          inRecycleBin: boolean;
          placingInBinTime: Timestamp | null;
          insertedIntoBinByUserId: string;
        }
      >
    | HistoryAction<
        "labels",
        {
          name: string;
          color: (typeof LABEL_COLORS)[number];
          id: string;
          replacedByLabelId: string | null;
          inRecycleBin: boolean;
          placingInBinTime: Timestamp | null;
          insertedIntoBinByUserId: string;
        }
      >
    | HistoryAction<"placingInBinTime", Timestamp>
  )[];
  workspaceId: string | null;
}
