import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface NormsForMonthHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | ({ userId: string } & historyAction<"normPercentage", number>)
    | ({ userId: string } & historyAction<"normExplanation", string>)
    | historyAction<"title" | "description" | "workPointsExplanation", string>
    | historyAction<"placingInBinTime", Timestamp>
    | ({ explanation: string } & historyAction<
        "duration",
        { startDay: Timestamp; endDay: Timestamp }
      >)
    | ({ explanation: string } & historyAction<"plannedWorkPoints", number>)
  )[];
}
