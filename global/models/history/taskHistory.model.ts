import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface TaskHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<
        | "title"
        | "description"
        | "columnShortId"
        | "authorShortId"
        | "assignedUserShortId"
        | "priority"
        | "goalShortId",
        string
      >
    | historyAction<"storyPoints", number>
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
