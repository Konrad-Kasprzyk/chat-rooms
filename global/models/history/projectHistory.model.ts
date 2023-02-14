import { Timestamp } from "firebase/firestore";
import historyAction from "../../types/historyAction";

export default interface ProjectHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<
        | "title"
        | "description"
        | "permittedTeamsIds"
        | "taskStates"
        | "taskStates index"
        | "taskTypes"
        | "taskTypes index",
        string
      >
    | ({ userId: string } & historyAction<"users", string>)
    | ({ type: string } & historyAction<"taskTypes color", string>)
    | historyAction<"visible", boolean>
    | historyAction<"placingInBinTime", Timestamp>
  )[];
}
