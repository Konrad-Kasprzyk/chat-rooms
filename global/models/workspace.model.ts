import { Timestamp } from "firebase/firestore";
import LABEL_COLORS from "../constants/colors";

export default interface Workspace {
  id: string;
  url: string;
  title: string;
  description: string;
  projectUsers: { id: string; shortId: string }[];
  invitedUserIds: string[];
  columns: {
    name: string;
    taskFinishColumn: boolean;
    shortId: string;
    replacedByColumnShortId: string | null;
    inRecycleBin: boolean;
    placingInBinTime: Timestamp | null;
    insertedIntoBinByUserId: string;
  }[];
  labels: {
    name: string;
    color: typeof LABEL_COLORS[number];
    shortId: string;
    replacedByLabelShortId: string | null;
    inRecycleBin: boolean;
    placingInBinTime: Timestamp | null;
    insertedIntoBinByUserId: string;
  }[];
  historyId: string;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
  insertedIntoBinByUserId: string;
}
