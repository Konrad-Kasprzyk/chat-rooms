import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";

export default interface TaskPack {
  id: string;
  shortId: hexArray;
  title: string;
  index: number;
  assignedStoryPoints: number;
  earnedStoryPoints: number;
  queuedTaskCount: number;
  activatedTaskCount: number;
  finishedTaskCount: number;
  allTasksFinished: boolean;
  createdTime: Timestamp;
  firstTaskActivationTime: Timestamp | null;
  allTasksFinishTime: Timestamp | null;
  blockUntilThoseActivated: boolean;
  blockUntilThoseAndAboveActivated: boolean;
  canActivatePriorityOnly: boolean;
  authorId: string;
  projectId: string;
  projectUsers: { id: string; role: "basic" | "admin" | "super admin" | "owner" }[];
  historyId: string;
  permanentDeletionTime: Timestamp | null;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
}
