import { Timestamp } from "firebase/firestore";
import NormHistory from "./normHistory.model";

export default interface Norm {
  id: string;
  title: string;
  description: string;
  projectId: string;
  startDay: Timestamp;
  endDay: Timestamp;
  authorId: string;
  plannedStoryPoints: number;
  recentHistory: NormHistory["history"];
  previousHistoryId: string;
  permanentDeletionTime: Timestamp | undefined;
  whenPutInBin: Timestamp | undefined;
  inRecycleBin: boolean;
}
