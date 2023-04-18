import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface NormHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<"description" | "authorId", string>
    | historyAction<"storyPoints", number>
    | historyAction<
        "usersNorm",
        {
          userId: string;
          capacityPercentage: number;
          capacityExplanation: string | null;
          included: boolean;
        }
      >
    | historyAction<"startDay" | "endDay" | "placingInBinTime", Timestamp>
  )[];
  lastModifiedNormId: string | null;
}
