import { Timestamp } from "firebase/firestore";

type goalFilters = {
  workspaceId: string;
  authorId?: string;
  searchKeys?: string[];
  sortBy?:
    | "index"
    | "creation time"
    | "modification time"
    | "last task assignment time"
    | "last task completion time"
    | "deadline";
  ascending?: boolean;
  fromDate?: Timestamp;
};

export default goalFilters;
