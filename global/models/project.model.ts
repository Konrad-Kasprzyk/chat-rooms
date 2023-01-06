import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";
import { TASK_TYPES_COLORS } from "../constants/tasks";

/**
 * @permittedTeamsIds When undefined, then all users are permitted to apply to join project
 * @visible When false, then only users from permitted teams can see this project
 */
export default interface Project {
  id: string;
  title: string;
  description: string;
  searchSubstrings: string[];
  users: { id: string; role: "basic" | "admin" | "super admin" | "owner" }[];
  permittedTeamsIds: string[] | undefined;
  visible: boolean;
  pendingUsersIds: string[];
  goalsIds: string[];
  tasksIds: string[];
  taskStatuses: { status: string; shortId: hexArray }[];
  taskTypes: { type: string; color: typeof TASK_TYPES_COLORS[number]; shortId: hexArray }[];
  normsIds: string[];
  autoDailyNormId: string;
  pastAutoDailyNormsIds: string;
  historyId: string;
  permanentDeletionTime: Timestamp | undefined;
  whenPutInBin: Timestamp | undefined;
  inRecycleBin: boolean;
}
