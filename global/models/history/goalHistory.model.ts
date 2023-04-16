import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface GoalHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<"title" | "description" | "authorShortId", string>
    | historyAction<"storyPoints", number>
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
          date: Timestamp;
        }
      >
    | historyAction<
        "creationTime" | "modificationTime" | "deadline" | "placingInBinTime",
        Timestamp
      >
  )[];
}
