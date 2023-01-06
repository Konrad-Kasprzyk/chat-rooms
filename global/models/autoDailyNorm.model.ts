import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";

export default interface AutoDailyNorm {
  id: string;
  projectId: string;
  day: Timestamp;
  // If typeShortId or goalId is set but not found in database, it's considered as unset
  finishedTasks: {
    storyPoints: number;
    assignedUserId: string;
    typeShortId: hexArray | null;
    goalId: string | null;
  }[];
}
