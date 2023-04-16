import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface NormHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<"description" | "authorShortId", string>
    | historyAction<"storyPoints", number>
    | historyAction<
        "usersNorm",
        {
          userShortId: string;
          capacityPercentage: number | null;
          capacityExplanation: string | null;
          included: boolean;
        }
      >
    | historyAction<"startDay" | "endDay" | "placingInBinTime", Timestamp>
  )[];
}
