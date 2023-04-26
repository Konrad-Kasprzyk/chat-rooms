import { Timestamp } from "firebase/firestore";
import LABEL_COLORS from "../../constants/colors";
import historyAction from "../../types/historyAction";

export default interface WorkspaceHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<"title" | "description", string>
    | historyAction<"userIds" | "invitedUserIds", string[]>
    | historyAction<
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
    | historyAction<
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
    | historyAction<"placingInBinTime", Timestamp>
  )[];
  workspaceId: string | null;
}
