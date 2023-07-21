import HistoryAction from "common/types/historyAction.type";
import { Timestamp } from "firebase/firestore";
import typia from "typia";

export default interface GoalHistory {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * @minLength 1
   */
  previousHistoryId: string | null;
  history: (
    | HistoryAction<"title" | "description" | "authorId", string>
    | HistoryAction<"storyPoints", number>
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
        "creationTime" | "modificationTime" | "deadline" | "placingInBinTime",
        Timestamp
      >
  )[];
  /**
   * @minLength 1
   */
  lastModifiedGoalId: string | null;
}

export const validateGoalHistory = typia.createValidateEquals<GoalHistory>();
