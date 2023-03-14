import { Timestamp } from "firebase/firestore";

/**
 * Holds norms starting the selected month
 */
export default interface Norm {
  id: string;
  projectId: string;
  startDay: Timestamp;
  endDay: Timestamp;
  title: string;
  description: string;
  usersNorm: {
    userShortId: string;
    normPercentage: number | null;
    normExplanation: string | null;
    excluded: boolean;
  }[];
  authorShortId: string;
  plannedStoryPoints: number;
  storyPointsExplanation: string;
  historyId: string;
  permanentDeletionTime: Timestamp | null;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
  insertedIntoBinByUserId: string;
}
