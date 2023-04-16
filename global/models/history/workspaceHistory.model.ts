import { Timestamp } from "firebase/firestore";
import LABEL_COLORS from "../../constants/colors";
import historyAction from "../../types/historyAction";

export default interface WorkspaceHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<"title" | "description", string>
    | historyAction<"projectUsers", { id: string; shortId: string }>
    | historyAction<"invitedUserIds", string[]>
    | historyAction<
        "columns",
        {
          name: string;
          taskFinishColumn: boolean;
          shortId: string;
          replacedByColumnShortId: string | null;
          inRecycleBin: boolean;
          placingInBinTime: Timestamp | null;
          insertedIntoBinByUserId: string;
        }
      >
    | historyAction<
        "labels",
        {
          name: string;
          color: typeof LABEL_COLORS[number];
          shortId: string;
          replacedByLabelShortId: string | null;
          inRecycleBin: boolean;
          placingInBinTime: Timestamp | null;
          insertedIntoBinByUserId: string;
        }
      >
    | historyAction<"placingInBinTime", Timestamp>
  )[];
}
