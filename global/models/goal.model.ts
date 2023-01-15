import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";
import GoalHistory from "./goalHistory.model";

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
  deadline: Timestamp | null;
  authorId: string;
  projectId: string;
  notes: string[];
  recentHistory: GoalHistory["history"];
  previousHistoryId: string;
  permanentDeletionTime: Timestamp | undefined;
  whenPutInBin: Timestamp | undefined;
  inRecycleBin: boolean;
}
