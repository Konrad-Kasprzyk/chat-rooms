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
  subTasks: string[];
  createdTime: Timestamp;
  activatedTime: Timestamp | null;
  stageChangedTime: Timestamp | null;
  modifiedTime: Timestamp | null;
  finishedTime: Timestamp | null;
  priority: boolean;
  authorId: string;
  assignedUserId: string;
  taggedUsers: { shortId: hexArray; id: string }[];
  taggedTasks: { shortId: hexArray; id: string }[];
  taggedGoals: { shortId: hexArray; id: string }[];
  taggedTaskPacks: { shortId: hexArray; id: string }[];
  taskPackId: string | null;
  projectId: string;
  goalsIds: string[];
  notes: { userId: string; note: string }[];
  projectUsers: { id: string; role: "basic" | "admin" | "super admin" | "owner" }[];
  historyId: string;
  isAddedToMonthlyStats: boolean;
  permanentDeletionTime: Timestamp | null;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
}
