import { Timestamp } from "firebase/firestore";
import LABEL_COLORS from "../constants/colors";

/**
 * @permittedTeamsIds When undefined, then all users are permitted to apply to join project
 */
export default interface Workspace {
  id: string;
  title: string;
  description: string;
  projectUsers: { id: string; projectOwner: boolean; shortId: string }[];
  invitedUserIds: string[];
  columns: { name: string; taskFinishColumn: boolean; shortId: string }[];
  taskLabels: { name: string; color: typeof LABEL_COLORS[number]; shortId: string }[];
  goalLabels: { name: string; color: typeof LABEL_COLORS[number]; shortId: string }[];
  historyId: string;
  permanentDeletionTime: Timestamp | null;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
  insertedIntoBinByUserId: string;
}
