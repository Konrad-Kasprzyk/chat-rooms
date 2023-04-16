import { Timestamp } from "firebase/firestore";

// Zaktualizuj z opisem programu
export default interface Goal {
  id: string;
  projectId: string;
  // used in url
  searchId: number;
  // used in completed tasks stats
  shortId: string;
  title: string;
  description: string;
  index: number;
  authorShortId: string;
  storyPoints: number | null;
  taskStats: {
    activeCount: number;
    totalCount: number;
    activeStoryPointsSum: number;
    totalStoryPointsSum: number;
  };
  objectives: {
    objective: string;
    done: boolean;
  }[];
  notes: { userShortId: string; note: string; date: Timestamp }[];
  creationTime: Timestamp;
  modificationTime: Timestamp | null;
  lastTaskAssignmentTime: Timestamp | null;
  lastTaskCompletionTime: Timestamp | null;
  deadline: Timestamp | null;
  historyId: string;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
  insertedIntoBinByUserId: string;
}
