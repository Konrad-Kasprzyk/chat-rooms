import HistoryAction from "common/types/historyAction.type";
import { Timestamp } from "firebase/firestore";
import typia from "typia";

export default interface NormHistory {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * @minLength 1
   */
  previousHistoryId: string | null;
  history: (
    | HistoryAction<"description" | "authorId", string>
    | HistoryAction<"storyPoints", number>
    | HistoryAction<
        "usersNorm",
        {
          userId: string;
          capacityPercentage: number;
          capacityExplanation: string;
          included: boolean;
        }
      >
    | HistoryAction<"startDay" | "endDay" | "placingInBinTime", Timestamp>
  )[];
  /**
   * @minLength 1
   */
  lastModifiedNormId: string | null;
}

export const validateNormHistory = typia.createValidateEquals<NormHistory>();
