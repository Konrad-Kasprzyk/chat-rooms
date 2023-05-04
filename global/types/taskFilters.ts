import { Timestamp } from "firebase/firestore";
import PRIORITIES from "../constants/priorities";

type TaskFilters = {
  workspaceId: string;
  authorId?: string;
  isAssigned?: boolean;
  assignedUserId?: string;
  hasGoal?: boolean;
  goalIds?: string[];
  hasLabel?: boolean;
  labelIds?: string[];
  hasPriority?: boolean;
  priorities?: (typeof PRIORITIES)[number][];
  searchKeys?: string[];
  sortBy?:
    | "index"
    | "creation time"
    | "modification time"
    | "column change time"
    | "completion time";
  ascending?: boolean;
  fromDate?: Timestamp;
};

export default TaskFilters;
