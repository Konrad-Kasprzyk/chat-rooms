import { Timestamp } from "firebase/firestore";
import LABEL_COLORS from "../../constants/colors";
import historyAction from "../../types/historyAction";

export default interface WorkspaceHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<"title" | "description", string>
    | historyAction<"projectUsers", { id: string; projectOwner: boolean; shortId: string }>
    | historyAction<"invitedUserIds", string[]>
    | historyAction<"columns", { name: string; taskFinishColumn: boolean; shortId: string }>
    | historyAction<
        "taskLabels" | "goalLabels",
        { name: string; color: typeof LABEL_COLORS[number]; shortId: string }
      >
    | historyAction<"placingInBinTime", Timestamp>
  )[];
}
