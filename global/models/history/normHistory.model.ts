import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface NormHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<"title" | "description" | "authorShortId" | "storyPointsExplanation", string>
    | historyAction<"plannedStoryPoints", number>
    | historyAction<
        "usersNorm",
        {
          userShortId: string;
          normPercentage: number | null;
          normExplanation: string | null;
          excluded: boolean;
        }
      >
    | historyAction<"startDay" | "endDay" | "placingInBinTime", Timestamp>
  )[];
}
