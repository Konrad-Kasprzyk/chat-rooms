import { Timestamp } from "firebase/firestore";
import LABEL_COLORS from "../constants/colors";

export default interface Workspace {
  id: string;
  // In addition to being an url, it is also an id of WorkspaceUrl.
  url: string;
  title: string;
  description: string;
  userIds: string[];
  invitedUserIds: string[];
  columns: {
    name: string;
    taskFinishColumn: boolean;
    id: string;
    replacedByColumnId: string | null;
    inRecycleBin: boolean;
    placingInBinTime: Timestamp | null;
    insertedIntoBinByUserId: string;
  }[];
  labels: {
    name: string;
    color: (typeof LABEL_COLORS)[number];
    id: string;
    replacedByLabelId: string | null;
    inRecycleBin: boolean;
    placingInBinTime: Timestamp | null;
    insertedIntoBinByUserId: string;
  }[];
  counterId: string;
  hasItemsInBin: boolean;
  historyId: string;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
  insertedIntoBinByUserId: string | null;
  testing: boolean;
}
