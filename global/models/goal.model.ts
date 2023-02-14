import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";

export default interface Goal {
  id: string;
  shortId: hexArray;
  title: string;
  description: string;
  storyPoints: number;
  objectives: {
    title: string;
    description: string;
    notes: { userId: string; note: string }[];
    done: boolean;
  }[];
  createdTime: Timestamp;
  activatedTime: Timestamp | null;
  modifiedTime: Timestamp | null;
  finishedTime: Timestamp | null;
  deadline: Timestamp | null;
  authorId: string;
  projectId: string;
  taggedUsers: { shortId: hexArray; id: string }[];
  taggedTasks: { shortId: hexArray; id: string }[];
  taggedGoals: { shortId: hexArray; id: string }[];
  taggedTaskPacks: { shortId: hexArray; id: string }[];
  notes: { userId: string; note: string }[];
  projectUsers: { id: string; role: "basic" | "admin" | "super admin" | "owner" }[];
  historyId: string;
  permanentDeletionTime: Timestamp | null;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
}
