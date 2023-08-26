import { Timestamp } from "firebase/firestore";

type GoalFilters = {
  workspaceId: string;
  howMany: number;
  authorId?: string;
  sortBy?:
    | "storyPoints"
    | "index"
    | "deadline"
    | "modificationTime"
    | "lastTaskCompletionTime"
    | "lastTaskAssignmentTime"
    | "creationTime";
  ascending?: boolean;
  fromValue?: number;
  fromDate?: Timestamp;
};

export default GoalFilters;
