import { Timestamp } from "firebase/firestore";
import historyAction from "../types/historyActions";

export default interface TaskHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<
        | "title"
        | "description"
        | "type"
        | "status"
        | "subTasks"
        | "subTasks index"
        | "assignedUserId"
        | "notes"
        | "notes index"
        | "goalId",
        string
      >
    | historyAction<"createdTime" | "activatedTime" | "finishedTime", Timestamp>
    | historyAction<"storyPoints", number>
  )[];
}
