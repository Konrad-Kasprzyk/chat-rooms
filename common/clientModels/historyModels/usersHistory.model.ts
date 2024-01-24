import ArchivedRecord from "common/types/history/archivedRecord.type";
import ArchivedUser from "common/types/history/archivedUser.type";
import ModelRecord from "common/types/history/modelRecord.type";
import User from "../user.model";
import Workspace from "../workspace.model";

/**
 * Stores information about adding and removing users from the workspace.
 * Stores information about inviting users and cancelling user invitations.
 */
export default interface UsersHistory {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * @minLength 1
   */
  workspaceId: string;
  /**
   * @minLength 1
   */
  olderHistoryId: string | null;
  /**
   * @minLength 1
   */
  newerHistoryId: string | null;
  history: (
    | ModelRecord<Workspace, "invitedUserEmails", string>
    | ModelRecord<Workspace, "users", User>
    | ArchivedRecord<"userRemovedFromWorkspace", ArchivedUser>
  )[];
  modificationTime: Date;
}
