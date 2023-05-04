import CompletedTaskStats from "../global/models/completedTaskStats.model";
import StatsFilters from "../global/types/statsFilters";

/**
 *
 * @param workspaceId
 * @param latestTaskFinishDate - stats with all tasks completed after this date
 *  will be omitted.
 * @returns
 */
export function filterCompletedTaskStats(
  filters: StatsFilters,
  howMany: number
): BehaviorSubject<CompletedTaskStats[]> {
  return null;
}
