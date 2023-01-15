import { Timestamp } from "firebase/firestore";
import historyAction from "../types/historyActions";

export default interface NormHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<"title" | "description", string>
    | historyAction<"startDay" | "endDay", Timestamp>
    | historyAction<"plannedStoryPoints", number>
  )[];
}
