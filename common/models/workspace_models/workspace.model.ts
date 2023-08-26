import Column from "common/models/workspace_models/column.type";
import Label from "common/models/workspace_models/label.type";
import { Timestamp } from "firebase/firestore";

export default interface Workspace {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * In addition to being an url, it is also an id of WorkspaceUrl.
   * @minLength 1
   */
  url: string;
  /**
   * @minLength 1
   */
  title: string;
  description: string;
  /**
   * @minLength 1
   */
  userIds: string[];
  /**
   * @minLength 1
   */
  invitedUserIds: string[];
  /**
   * @minItems 2
   */
  columns: Column[];
  labels: Label[];
  hasItemsInBin: boolean;
  modificationTime: Timestamp;
  creationTime: Timestamp;
  // /**
  //  * @minLength 1
  //  */
  // historyId: string;
  placingInBinTime: Timestamp | null;
  /**
   * @minLength 1
   */
  insertedIntoBinByUserId: string | null;
}
