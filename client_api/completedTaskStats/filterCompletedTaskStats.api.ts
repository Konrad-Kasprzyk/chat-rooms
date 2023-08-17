import CompletedTaskStats from "common/models/completedTaskStats.model";
import StatsFilters from "common/types/filters/statsFilters.type";
import { BehaviorSubject } from "rxjs";

/**
 *
 * @param workspaceId
 * @param latestTaskFinishDate - stats with all tasks completed after this date
 *  will be omitted.
 * @returns
 */
export default function filterCompletedTaskStats(
  filters: StatsFilters,
  howMany: number
): BehaviorSubject<CompletedTaskStats[]> {
  return null;
}