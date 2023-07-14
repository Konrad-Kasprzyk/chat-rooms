import HistoryAction from "common/types/historyAction.type";
import { Timestamp } from "firebase/firestore";

export default interface TaskHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | HistoryAction<
        | "title"
        | "description"
        | "columnId"
        | "authorId"
        | "assignedUserId"
        | "priority"
        | "goalId",
        string
      >
    | HistoryAction<"storyPoints", number>
    | HistoryAction<"labelIds", string[]>
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
        | "creationTime"
        | "modificationTime"
        | "columnChangeTime"
        | "completionTime"
        | "placingInBinTime",
        Timestamp
      >
  )[];
  lastModifiedTaskId: string | null;
}
