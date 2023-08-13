import Goal from "common/models/goal.model";
import GoalFilters from "common/types/filters/goalFilters.type";
import { BehaviorSubject } from "rxjs";

export default function filterGoals(
  filters: GoalFilters,
  howMany: number
): BehaviorSubject<Goal[]> {
  return null;
}
