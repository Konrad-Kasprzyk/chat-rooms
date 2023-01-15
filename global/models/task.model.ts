import { Timestamp } from "firebase/firestore";
import type HEX_ARRAY from "../types/hexArray";
import type TaskHistory from "./taskHistory.model";

export default interface Task {
  id: string;
  shortId: HEX_ARRAY;
  title: string;
  description: string;
  storyPoints: number;
  typeShortId: HEX_ARRAY;
  statusShortId: HEX_ARRAY;
  subTasks: string[];
  createdTime: Timestamp;
  activatedTime: Timestamp | null;
  modifiedTime: Timestamp | null;
  finishedTime: Timestamp | null;
  authorId: string;
  assignedUserId: string;
  taggedUsers: { shortId: HEX_ARRAY; id: string }[];
  taggedTasks: { shortId: HEX_ARRAY; id: string }[];
  taggedGoals: { shortId: HEX_ARRAY; id: string }[];
  projectId: string;
  goalId: string;
  notes: string[];
  recentHistory: TaskHistory["history"];
  previousHistoryId: string;
  permanentDeletionTime: Timestamp | null;
  whenPutInBin: Timestamp | null;
  inRecycleBin: boolean;
}
