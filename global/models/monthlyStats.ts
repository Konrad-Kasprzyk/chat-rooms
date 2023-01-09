import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";

export default interface MonthlyStats {
  id: string;
  projectId: string;
  month: Timestamp;
  // If typeShortId or goalId is set but not found in database, it's considered as unset
  finishedTasks: {
    day: Timestamp;
    goals: { goalId: string; storyPoints: number }[];
    types: { typeShortId: hexArray; storyPoints: number }[];
    users: { assignedUserId: string; storyPoints: number }[];
  }[];
}
