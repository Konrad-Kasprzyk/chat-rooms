import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface GoalHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<"title" | "description" | "authorShortId" | "priority", string>
    | historyAction<"estimatedStoryPoints", number>
    | historyAction<"labelShortIds", string[]>
    | historyAction<
        "objectives",
        {
          objective: string;
          done: boolean;
        }
      >
    | historyAction<
        "notes",
        {
          userShortId: string;
          note: string;
        }
      >
    | historyAction<
        "creationTime" | "modificationTime" | "completionTime" | "deadline" | "placingInBinTime",
        Timestamp
      >
  )[];
}
