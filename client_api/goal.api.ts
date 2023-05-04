import { BehaviorSubject } from "rxjs";
import Goal from "../global/models/goal.model";
import GoalFilters from "../global/types/goalFilters";

export function createGoal(workspaceId: string, title: string, description: string): string {
  //   const auth = getAuth();
  // const user = auth.currentUser;
  return "goal id";
}

export function removeGoal(goalId: string): void {
  return null;
}

export function filterGoals(filters: GoalFilters, howMany: number): BehaviorSubject<Goal[]> {
  return null;
}

export function changeGoalTitle(goalId: string, newTitle: string): void {
  return null;
}

export function changeGoalDescription(goalId: string, newDescription: string): void {
  return null;
}

export function changeGoalIndex(
  goalId: string,
  newPrecedingIndex: number,
  newSubsequentIndex: number
): number {
  return null;
}

export function addGoalObjective(goalId: string, objective: string): void {
  return null;
}

export function changeGoalObjective(
  goalId: string,
  objectiveIndex: number,
  newObjective: string
): void {
  return null;
}

export function markGoalObjectiveCompleted(goalId: string, objectiveIndex: number): void {
  return null;
}

export function markGoalObjectiveUncompleted(goalId: string, objectiveIndex: number): void {
  return null;
}

export function removeGoalObjective(goalId: string, objectiveIndex: number): void {
  return null;
}

export function addGoalNote(goalId: string, note: string): void {
  //   const auth = getAuth();
  // const user = auth.currentUser;
  return null;
}

export function changeGoalNote(goalId: string, noteIndex: number, newNote: string): void {
  return null;
}

export function removeGoalNote(goalId: string, noteIndex: number): void {
  return null;
}
