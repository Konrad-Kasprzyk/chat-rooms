import CompletedTaskStats from "common/models/completedTaskStats.model";
import StatsFilters from "common/types/subscriptions/statsFilters";

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
