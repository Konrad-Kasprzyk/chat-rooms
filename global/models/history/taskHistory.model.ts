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
        | "priority",
        string
      >
    | historyAction<"storyPoints", number>
    | historyAction<"labelShortIds", string[]>
    | historyAction<"goalShortIds", string[]>
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
        | "creationTime"
        | "modificationTime"
        | "columnInsertionTime"
        | "deadline"
        | "placingInBinTime",
        Timestamp
      >
  )[];
}
