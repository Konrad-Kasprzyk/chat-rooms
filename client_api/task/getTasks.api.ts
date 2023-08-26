import Task from "common/models/task.model";
import TaskFilters from "common/types/filters/taskFilters.type";

export default async function getTasks(
  filters: TaskFilters & { searchKeys?: string[] }
): Promise<Task[]> {
  return null;
}
