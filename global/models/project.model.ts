import { Timestamp } from "firebase/firestore";
import type hexArray from "../types/hexArray";
import { TASK_TYPES_COLORS } from "../constants/tasks";
import ProjectHistory from "./projectHistory.model";

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
  taskStatuses: { status: string; shortId: hexArray }[];
  taskTypes: { type: string; color: typeof TASK_TYPES_COLORS[number]; shortId: hexArray }[];
  recentHistory: ProjectHistory["history"];
  previousHistoryId: string;
  permanentDeletionTime: Timestamp | undefined;
  whenPutInBin: Timestamp | undefined;
  inRecycleBin: boolean;
}
