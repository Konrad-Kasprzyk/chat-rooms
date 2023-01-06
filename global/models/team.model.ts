import { Timestamp } from "firebase/firestore";

export default interface Team {
  id: string;
  title: string;
  description: string;
  searchSubstrings: string[];
  users: { id: string; role: "basic" | "admin" | "owner" }[];
  pendingUsersIds: string[];
  teamProjectsIds: string[];
  visible: boolean;
  historyId: string;
  permanentDeletionTime: Timestamp | undefined;
  whenPutInBin: Timestamp | undefined;
  inRecycleBin: boolean;
}
