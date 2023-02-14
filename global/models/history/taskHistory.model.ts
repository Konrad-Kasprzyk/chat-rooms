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
        | "subTasks"
        | "subTasks index"
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
