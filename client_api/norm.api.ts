import { Timestamp } from "firebase/firestore";
import Norm from "../global/models/norm.model";
import NormFilters from "../global/types/normFilters";

export function createNorm(
  workspaceId: string,
  description: string,
  startDay: Timestamp,
  endDay: Timestamp,
  storyPoints: number | null = null
): string {
  return "norm id";
}

export function removeNorm(normId: string): void {
  return null;
}

export function filterNorms(filters: NormFilters, howMany: number): BehaviorSubject<Norm[]> {
  return null;
}

export function changeNormDescription(normId: string, newDescription: string): void {
  return null;
}

export function changeNormStoryPoints(normId: string, newStoryPoints: number): void {
  return null;
}

export function changeNormStartDay(normId: string, newStartDay: Timestamp): void {
  return null;
}

export function changeNormEndDay(normId: string, newEndDay: Timestamp): void {
  return null;
}

export function changeUserCapacityPercentage(
  normId: string,
  userId: string,
  newCapacityPercentage: number
): void {
  return null;
}

export function changeUserCapacityExplanation(
  normId: string,
  userId: string,
  newCapacityExplanation: string
): void {
  return null;
}

export function removeUserCapacityExplanation(normId: string, userId: string): void {
  return null;
}

export function excludeUserFromNorm(normId: string, userId: string): void {
  return null;
}

export function includeUserToNorm(normId: string, userId: string): void {
  return null;
}
