import { Timestamp } from "firebase/firestore";

/**
 * Holds norms starting the selected month
 */
export default interface Norm {
  id: string;
  projectId: string;
  // used in url
  searchId: number;
  startDay: Timestamp;
  endDay: Timestamp;
  description: string;
  usersNorm: {
    userId: string;
    capacityPercentage: number;
    capacityExplanation: string | null;
    included: boolean;
  }[];
  authorId: string;
  storyPoints: number;
  historyId: string;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
  insertedIntoBinByUserId: string;
}
