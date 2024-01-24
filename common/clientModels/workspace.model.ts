import Column from "common/types/column.type";
import Label from "common/types/label.type";
import type { tags } from "typia";
import User from "./user.model";

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
  users: User[];
  userIds: Array<string & tags.MinLength<1>>;
  invitedUserEmails: Array<string & tags.Format<"email">>;
  /**
   * @minItems 2
   */
  columns: Column[];
  labels: Label[];
  modificationTime: Date;
  creationTime: Date;
  // /**
  //  * @minLength 1
  //  */
  // newestHistoryId: string;
  // /**
  //  * @minLength 1
  //  */
  // oldestHistoryId: string;
  placingInBinTime: Date | null;
}
