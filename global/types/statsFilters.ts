import { Timestamp } from "firebase/firestore";

type StatsFilters = {
  workspaceId: string;
  latestTaskCompleteDate?: Timestamp;
};

export default StatsFilters;
