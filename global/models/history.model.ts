import {
  goalHistoryActions,
  normHistoryActions,
  projectHistoryActions,
  taskHistoryActions,
  teamHistoryActions,
} from "../types/historyActions";

export default interface History {
  id: string;
  model: "task" | "goal" | "project" | "norm" | "team";
  history:
    | taskHistoryActions[]
    | goalHistoryActions[]
    | projectHistoryActions[]
    | normHistoryActions[]
    | teamHistoryActions[];
}
