import { Timestamp } from "firebase/firestore";

/**
 * Holds norms starting the selected month
 */
export default interface NormsForMonth {
  id: string;
  month: Timestamp;
  norms: {
    startDay: Timestamp;
    endDay: Timestamp;
    title: string;
    description: string;
    usersNorm: { userId: string; normPercentage: number; normExplanation: string }[];
    authorId: string;
    plannedStoryPoints: number;
    storyPointsExplanation: string;
    historyId: string;
    permanentDeletionTime: Timestamp | null;
    placingInBinTime: Timestamp | null;
    inRecycleBin: boolean;
  }[];
  projectUsers: { id: string; role: "basic" | "admin" | "super admin" | "owner" }[];
  projectId: string;
}
