import { Timestamp } from "firebase/firestore";
import TeamHistory from "./teamHistory.model";

export default interface Team {
  id: string;
  title: string;
  description: string;
  searchSubstrings: string[];
  users: { id: string; role: "basic" | "admin" | "owner" }[];
  pendingUsersIds: string[];
  teamProjectsIds: string[];
  visible: boolean;
  recentHistory: TeamHistory["history"];
  previousHistoryId: string;
  permanentDeletionTime: Timestamp | undefined;
  whenPutInBin: Timestamp | undefined;
  inRecycleBin: boolean;
}
