import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";

export default interface Goal {
  id: string;
  shortId: hexArray;
  title: string;
  description: string;
  storyPoints: number;
  subGoals: string[];
  createdTime: Timestamp;
  activatedTime: Timestamp | null;
  modifiedTime: Timestamp | null;
  finishedTime: Timestamp | null;
  authorId: string;
  projectId: string;
  tasksIds: string[];
  notes: string[];
  historyId: string;
  permanentDeletionTime: Timestamp | undefined;
  whenPutInBin: Timestamp | undefined;
  inRecycleBin: boolean;
}
