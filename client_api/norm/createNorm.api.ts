import { Timestamp } from "firebase/firestore";

export default async function createNorm(
  workspaceId: string,
  description: string,
  startDay: Timestamp,
  endDay: Timestamp,
  storyPoints: number | null = null
): Promise<string> {
  return "norm id";
}
