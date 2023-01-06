import { Timestamp } from "firebase/firestore";

export default interface Norm {
  id: string;
  title: string;
  description: string;
  projectId: string;
  startDay: Timestamp;
  endDay: Timestamp;
  authorId: string;
  plannedStoryPoints: number;
  historyId: string;
  permanentDeletionTime: Timestamp | undefined;
  whenPutInBin: Timestamp | undefined;
  inRecycleBin: boolean;
}
