import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface GoalHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<"title" | "description" | "authorId", string>
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
          userId: string;
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
