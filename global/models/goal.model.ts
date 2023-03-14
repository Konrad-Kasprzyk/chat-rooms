import { Timestamp } from "firebase/firestore";

export default interface Goal {
  id: string;
  projectId: string;
  searchId: number;
  shortId: string;
  title: string;
  description: string;
  index: number;
  authorShortId: string;
  estimatedStoryPoints: number | null;
  usedStoryPoints: number;
  lowPriority: boolean;
  normalPriority: boolean;
  highPriority: boolean;
  urgentPriority: boolean;
  labelShortIds: string[];
  taskCount: { low: number; normal: number; high: number; urgent: number };
  objectives: {
    objective: string;
    done: boolean;
  }[];
  notes: { userShortId: string; note: string }[];
  complete: boolean;
  creationTime: Timestamp;
  modificationTime: Timestamp | null;
  completionTime: Timestamp | null;
  deadline: Timestamp | null;
  historyId: string;
  permanentDeletionTime: Timestamp | null;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
  insertedIntoBinByUserId: string;
}
