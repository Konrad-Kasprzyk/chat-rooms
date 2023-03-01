import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface GoalHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<
        | "title"
        | "description"
        | "objectives"
        | "objectives index" //Holds two swapped objectives, not their indexes. That's why string instead a number.
        | "assignedUserId"
        | "notes"
        | "notes index",
        string
      >
    | historyAction<
        "createdTime" | "activatedTime" | "finishedTime" | "placingInBinTime",
        Timestamp
      >
    | historyAction<"storyPoints", number>
  )[];
}
