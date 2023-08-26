import { Timestamp } from "firebase/firestore";

type NormFilters = {
  workspaceId: string;
  howMany: number;
  /**
   * Get norms that end before this day, including it
   */
  endBeforeDay?: Timestamp;
  /**
   * Get norms that start after this day, including it
   */
  startDayAfter?: Timestamp;
};

export default NormFilters;
