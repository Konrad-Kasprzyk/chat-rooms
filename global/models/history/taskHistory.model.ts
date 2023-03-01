import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface TaskHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<
        | "title"
        | "description"
        | "type"
        | "stage"
        | "objectives"
        | "objectives index" //Holds two swapped objectives, not their indexes. That's why string instead a number.
        | "assignedUserId"
        | "notes"
        | "notes index"
        | "goalId",
        string
      >
    | historyAction<
        "createdTime" | "activatedTime" | "finishedTime" | "placingInBinTime",
        Timestamp
      >
    | historyAction<"storyPoints", number>
  )[];
}
