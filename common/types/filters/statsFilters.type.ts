import { Timestamp } from "firebase/firestore";

type StatsFilters = {
  workspaceId: string;
  /**
   * Get stats of all tasks completed after this day, including it
   */
  earliestTasksCompleteDay: Timestamp;
  /**
   * Get stats of all tasks completed before this day, including it
   */
  latestTasksCompleteDay: Timestamp;
};

export default StatsFilters;
