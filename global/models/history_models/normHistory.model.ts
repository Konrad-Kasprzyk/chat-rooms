import { Timestamp } from "firebase/firestore";
import HistoryAction from "global/types/historyAction";

export default interface NormHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | HistoryAction<"description" | "authorId", string>
    | HistoryAction<"storyPoints", number>
    | HistoryAction<
        "usersNorm",
        {
          userId: string;
          capacityPercentage: number;
          capacityExplanation: string | null;
          included: boolean;
        }
      >
    | HistoryAction<"startDay" | "endDay" | "placingInBinTime", Timestamp>
  )[];
  lastModifiedNormId: string | null;
}
