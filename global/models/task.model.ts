import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";
import type TaskHistory from "./history/taskHistory.model";

export default interface Task {
  id: string;
  shortId: hexArray;
  title: string;
  description: string;
  index: number;
  taskPackIndex: number | null;
  storyPoints: number;
  typeShortId: hexArray;
  stageShortId: hexArray;
  objectives: {
    objective: string;
    done: boolean;
  }[];
  createdTime: Timestamp;
  activatedTime: Timestamp | null;
  stageChangedTime: Timestamp | null;
  modifiedTime: Timestamp | null;
  finishedTime: Timestamp | null;
  priority: boolean;
  authorId: string;
  assignedUserId: string;
  taskPackId: string | null;
  projectId: string;
  goalIds: string[];
  notes: { userId: string; note: string }[];
  projectUsers: { id: string; role: "basic" | "admin" | "super admin" | "owner" }[];
  historyId: string;
  isAddedToMonthlyStats: boolean;
  permanentDeletionTime: Timestamp | null;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
}
