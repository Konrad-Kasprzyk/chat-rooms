import { Timestamp } from "firebase/firestore";

export default interface Task {
  id: string;
  projectId: string;
  searchId: number;
  shortId: string;
  title: string;
  description: string;
  labelShortIds: string[];
  goalShortIds: string[];
  // Contains goal short ids, label short ids, searchId substrings and substrings of the words of the title
  searchKeys: string[];
  columnShortId: string;
  index: number;
  storyPoints: number;
  authorShortId: string;
  isAssigned: boolean;
  assignedUserShortId: string;
  lowPriority: boolean;
  normalPriority: boolean;
  highPriority: boolean;
  urgentPriority: boolean;
  objectives: {
    objective: string;
    done: boolean;
  }[];
  notes: { userShortId: string; note: string }[];
  creationTime: Timestamp;
  modificationTime: Timestamp | null;
  columnInsertionTime: Timestamp;
  deadline: Timestamp | null;
  historyId: string;
  inRecycleBin: boolean;
  placingInBinTime: Timestamp | null;
  permanentDeletionTime: Timestamp | null;
  insertedIntoBinByUserId: string;
}
