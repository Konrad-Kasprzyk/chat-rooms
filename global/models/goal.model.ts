import { Timestamp } from "firebase/firestore";

export default interface Goal {
  id: string;
  workspaceId: string;
  // used in url
  searchId: number;
  // used in completed tasks stats
  shortId: string;
  title: string;
  description: string;
  index: number;
  authorId: string;
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
  notes: { userId: string; note: string; date: Timestamp }[];
  creationTime: Timestamp;
  modificationTime: Timestamp | null;
  lastTaskAssignmentTime: Timestamp | null;
  lastTaskCompletionTime: Timestamp | null;
  deadline: Timestamp | null;
  lastModifiedTaskId: string | null;
  historyId: string;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
  insertedIntoBinByUserId: string | null;
}
