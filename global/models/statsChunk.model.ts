import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";

export default interface StatsChunk {
  id: string;
  projectId: string;
  earliestTaskDate: Timestamp;
  // If typeShortId or goalId is set but not found, it's considered as unset
  finishedTasks: {
    day: Timestamp;
    goalId: string;
    typeShortId: hexArray;
    assignedUserId: string;
    storyPoints: number;
  }[];
}
