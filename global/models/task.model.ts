import { Timestamp } from "firebase/firestore";
import PRIORITIES from "../constants/priorities";

export default interface Task {
  id: string;
  projectId: string;
  // used in url
  searchId: number;
  // used in completed tasks stats
  shortId: string;
  title: string;
  description: string;
  labelShortIds: string[];
  goalShortId: string;
  // Contains goal short id, label short ids, searchId substrings and substrings of the words of the title
  searchKeys: string[];
  columnShortId: string;
  index: number;
  storyPoints: number;
  authorShortId: string;
  isAssigned: boolean;
  assignedUserShortId: string | null;
  priority: typeof PRIORITIES[number];
  objectives: {
    objective: string;
    done: boolean;
  }[];
  notes: { userShortId: string; note: string; date: Timestamp }[];
  creationTime: Timestamp;
  modificationTime: Timestamp;
  columnChangeTime: Timestamp;
  completionTime: Timestamp | null;
  assignmentHistory: {
    type: "goal" | "label" | "user" | "column";
    shortId: string;
    date: Timestamp;
  }[];
  historyId: string;
  inRecycleBin: boolean;
  placingInBinTime: Timestamp | null;
  insertedIntoBinByUserId: string;
}
