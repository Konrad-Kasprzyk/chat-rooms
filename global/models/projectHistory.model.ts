import historyAction from "../types/historyActions";

export default interface ProjectHistory {
  id: string;
  previousHistoryId: string | null;
  history: (
    | historyAction<
        | "title"
        | "description"
        | "permittedTeamsIds"
        | "taskStatuses"
        | "taskStatuses index"
        | "taskTypes"
        | "taskTypes index",
        string
      >
    | ({ userId: string } & historyAction<"users", string>)
    | ({ type: string } & historyAction<"taskTypes color", string>)
    | historyAction<"visible", boolean>
  )[];
}
