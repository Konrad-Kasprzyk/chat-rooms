import { Timestamp } from "firebase/firestore";
import { type HEX_ARRAY } from "../constants/hexChars";

export default interface AutoDailyNorm {
  id: string;
  projectId: string;
  day: Timestamp;
  // If typeShortId or goalId is set but not found in database, it's considered as unset
  finishedTasks: {
    storyPoints: number;
    assignedUserId: string;
    typeShortId: HEX_ARRAY | null;
    goalId: string | null;
  }[];
}
