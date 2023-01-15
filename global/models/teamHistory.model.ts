import historyAction from "../types/historyActions";

export default interface TeamHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<"title" | "description" | "teamProjectsIds", string>
    | ({ userId: string } & historyAction<"users", string>)
    | historyAction<"visible", boolean>
  )[];
}
