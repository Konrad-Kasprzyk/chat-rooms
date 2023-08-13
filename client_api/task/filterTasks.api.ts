import Task from "common/models/task.model";
import TaskFilters from "common/types/filters/taskFilters.type";
import { BehaviorSubject } from "rxjs";

export default function filterTasks(
  filters: TaskFilters & { searchKeys?: string[] },
  howMany: number
): BehaviorSubject<Task[]> {
  return null;
}
