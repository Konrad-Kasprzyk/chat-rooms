import { Timestamp } from "firebase/firestore";
import historyAction from "../types/historyActions";

export default interface GoalHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<
        | "title"
        | "description"
        | "subGoals"
        | "subGoals index"
        | "assignedUserId"
        | "notes"
        | "notes index",
        string
      >
    | historyAction<"createdTime" | "activatedTime" | "finishedTime", Timestamp>
    | historyAction<"storyPoints", number>
  )[];
}
