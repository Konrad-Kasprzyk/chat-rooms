import { Timestamp } from "firebase/firestore";
import Column from "global/types/column";
import Label from "global/types/label";

export default interface Workspace {
  id: string;
  // In addition to being an url, it is also an id of WorkspaceUrl.
  url: string;
  title: string;
  description: string;
  userIds: string[];
  invitedUserIds: string[];
  columns: Column[];
  labels: Label[];
  counterId: string;
  hasItemsInBin: boolean;
  historyId: string;
  placingInBinTime: Timestamp | null;
  inRecycleBin: boolean;
  insertedIntoBinByUserId: string | null;
}
