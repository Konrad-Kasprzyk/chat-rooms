import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";

export default interface Goal {
  id: string;
  shortId: hexArray;
  title: string;
  description: string;
  storyPoints: number;
  objectives: {
    objective: string;
    done: boolean;
  }[];
  createdTime: Timestamp;
  activatedTime: Timestamp | null;
  modifiedTime: Timestamp | null;
  finishedTime: Timestamp | null;
  deadline: Timestamp | null;
  authorId: string;
  projectId: string;
  notes: { userId: string; note: string }[];
  projectUsers: { id: string; role: "basic" | "admin" | "super admin" | "owner" }[];
  historyId: string;
  permanentDeletionTime: Timestamp | null;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
}
