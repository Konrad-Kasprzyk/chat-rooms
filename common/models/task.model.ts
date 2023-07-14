import PRIORITIES from "common/constants/priorities.constant";
import { Timestamp } from "firebase/firestore";

export default interface Task {
  id: string;
  workspaceId: string;
  // used in url
  searchId: number;
  // used in completed tasks stats
  shortId: string;
  title: string;
  description: string;
  labelIds: string[];
  goalId: string;
  // Contains goal short id, label short ids, searchId substrings and substrings of the words of the title
  searchKeys: string[];
  columnId: string;
  index: number;
  storyPoints: number;
  authorId: string;
  isAssigned: boolean;
  assignedUserId: string | null;
  priority: (typeof PRIORITIES)[number];
  objectives: {
    objective: string;
    done: boolean;
  }[];
  notes: { userId: string; note: string; date: Timestamp }[];
  creationTime: Timestamp;
  modificationTime: Timestamp;
  columnChangeTime: Timestamp;
  completionTime: Timestamp | null;
  historyId: string;
  inRecycleBin: boolean;
  placingInBinTime: Timestamp | null;
  insertedIntoBinByUserId: string | null;
}
