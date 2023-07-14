import PRIORITIES from "common/constants/priorities.constant";
import Task from "common/models/task.model";
import TaskFilters from "common/types/subscriptions/taskFilters.type";
import { BehaviorSubject } from "rxjs";

export function createTask(
  workspaceId: string,
  title: string,
  description: string,
  columnId: string
): string {
  //   const auth = getAuth();
  // const user = auth.currentUser;
  return "task id";
}

export function removeTask(taskId: string): void {
  return null;
}

export function filterTasks(
  filters: TaskFilters & { searchKeys?: string[] },
  howMany: number
): BehaviorSubject<Task[]> {
  return null;
}

export function changeTaskTitle(taskId: string, newTitle: string): void {
  return null;
}

export function changeTaskDescription(taskId: string, newDescription: string): void {
  return null;
}

export function changeTaskIndex(
  taskId: string,
  newPrecedingIndex: number,
  newSubsequentIndex: number
): number {
  return null;
}

export function addLabelToTask(taskId: string, labelId: string): void {
  return null;
}

export function removeLabelFromTask(taskId: string, labelId: string): void {
  return null;
}

export function addOrChangeTaskGoal(taskId: string, newGoalId: string): void {
  return null;
}

export function removeGoalFromTask(taskId: string): void {
  return null;
}

export function changeTaskColumn(taskId: string, newColumnId: string): void {
  return null;
}

export function addOrChangeTaskPriority(
  taskId: string,
  newPriority: (typeof PRIORITIES)[number]
): void {
  return null;
}

export function removeTaskPriority(taskId: string): void {
  return null;
}

export function addOrChangeTaskAssignee(taskId: string, newAssigneeId: string): void {
  return null;
}

export function removeTaskAssignee(taskId: string): void {
  return null;
}

export function addTaskObjective(taskId: string, objective: string): void {
  return null;
}

export function changeTaskObjective(
  taskId: string,
  objectiveIndex: number,
  newObjective: string
): void {
  return null;
}

export function markTaskObjectiveCompleted(taskId: string, objectiveIndex: number): void {
  return null;
}

export function markTaskObjectiveUncompleted(taskId: string, objectiveIndex: number): void {
  return null;
}

export function removeTaskObjective(taskId: string, objectiveIndex: number): void {
  return null;
}

export function addTaskNote(taskId: string, note: string): void {
  //   const auth = getAuth();
  // const user = auth.currentUser;
  return null;
}

export function changeTaskNote(taskId: string, noteIndex: number, newNote: string): void {
  return null;
}

export function removeTaskNote(taskId: string, noteIndex: number): void {
  return null;
}
