import PRIORITIES from "common/constants/priorities.constant";
import { Timestamp } from "firebase/firestore";

type TaskFilters = {
  workspaceId: string;
  howMany: number;
  authorId?: string;
  assignedUserId?: string | null;
  hasGoal?: boolean;
  /**
   * Return tasks which have any of the provided goal ids
   */
  goalIds?: string[];
  hasStoryPoints: boolean;
  hasAnyLabel?: boolean;
  labelIds?: string[];
  labelQueryType?: "any" | "all";
  hasPriority?: boolean;
  /**
   * Return tasks which have any of the provided priorities
   */
  priorities?: (typeof PRIORITIES)[number][];
  sortBy:
    | "storyPoints"
    | "index"
    | "completionTime"
    | "modificationTime"
    | "columnChangeTime"
    | "creationTime";
  ascending?: boolean;
  fromValue?: number;
  fromDate?: Timestamp;
};

export default TaskFilters;
