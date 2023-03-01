import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";
import { TASK_TYPES_COLORS } from "../constants/tasks";

/**
 * @permittedTeamsIds When undefined, then all users are permitted to apply to join project
 */
export default interface Workspace {
  id: string;
  title: string;
  description: string;
  projectUsers: { id: string; role: "basic" | "admin" | "super admin" | "owner" }[];
  invitedUserIds: string[];
  taskStages: { stage: string; shortId: hexArray }[];
  taskTypes: { type: string; color: typeof TASK_TYPES_COLORS[number]; shortId: hexArray }[];
  highestBlockingTaskPackIndex: number | null;
  historyId: string;
  permanentDeletionTime: Timestamp | null;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
}
