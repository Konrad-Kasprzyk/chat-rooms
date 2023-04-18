import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface TaskHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<
        | "title"
        | "description"
        | "columnId"
        | "authorId"
        | "assignedUserId"
        | "priority"
        | "goalId",
        string
      >
    | historyAction<"storyPoints", number>
    | historyAction<"labelIds", string[]>
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
        | "creationTime"
        | "modificationTime"
        | "columnChangeTime"
        | "completionTime"
        | "placingInBinTime",
        Timestamp
      >
  )[];
}
