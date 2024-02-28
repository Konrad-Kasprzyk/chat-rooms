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
  /**
   * Stores who created the workspace. Stores information about changing the title and description
   * of the workspace. Stores information about putting and restoring workspace from the recycle bin.
   * @minLength 1
   */
  newestWorkspaceHistoryId: string;
  /**
   * Stores information about adding and removing users from the workspace.
   * Stores information about inviting users and cancelling user invitations.
   * @minLength 1
   */
  newestUsersHistoryId: string;
  /**
   * @minLength 1
   */
  newestColumnsHistoryId: string;
  /**
   * @minLength 1
   */
  newestLabelsHistoryId: string;
  /**
   * @minLength 1
   */
  newestArchivedGoalsId: string;
  /**
   * @minLength 1
   */
  newestArchivedTasksId: string;
  placingInBinTime: Date | null;
  /**
   * Use it to check the date when the document was put into the IndexedDB.
   */
  fetchingFromSeverTime: Date;
  hasOfflineChanges: boolean;
}
