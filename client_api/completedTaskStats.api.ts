import { Timestamp } from "firebase/firestore";
import completedTaskStats from "../global/models/completedTaskStats.model";
import statsFilters from "../global/types/statsFilters";

/**
 *
 * @param workspaceId
 * @param latestTaskFinishDate - stats with all tasks completed after this date
 *  will be omitted.
 * @returns
 */
export function filterCompletedTaskStats(
  filters: statsFilters,
  howMany: number
): BehaviorSubject<completedTaskStats[]> {
  return null;
}
