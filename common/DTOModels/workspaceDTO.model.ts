import Column from "common/types/column.type";
import Label from "common/types/label.type";
import type { Timestamp } from "firebase-admin/firestore";
import type { tags } from "typia";

export default interface WorkspaceDTO {
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
  userIds: Array<string & tags.MinLength<1>>;
  invitedUserEmails: Array<string & tags.Format<"email">>;
  /**
   * @minItems 2
   */
  columns: Column[];
  labels: Label[];
  modificationTime: Timestamp;
  creationTime: Timestamp;
  // /**
  //  * @minLength 1
  //  */
  // newestHistoryId: string;
  // /**
  //  * @minLength 1
  //  */
  // oldestHistoryId: string;
  isInBin: boolean;
  placingInBinTime: Timestamp | null;
  isDeleted: boolean;
}
