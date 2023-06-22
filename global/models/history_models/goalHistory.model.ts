import { Timestamp } from "firebase/firestore";
import HistoryAction from "global/types/historyAction";

export default interface GoalHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | HistoryAction<"title" | "description" | "authorId", string>
    | HistoryAction<"storyPoints", number>
    | HistoryAction<
        "objectives",
        {
          objective: string;
          done: boolean;
        }
      >
    | HistoryAction<
        "notes",
        {
          userId: string;
          note: string;
          date: Timestamp;
        }
      >
    | HistoryAction<
        "creationTime" | "modificationTime" | "deadline" | "placingInBinTime",
        Timestamp
      >
  )[];
  lastModifiedGoalId: string | null;
}
