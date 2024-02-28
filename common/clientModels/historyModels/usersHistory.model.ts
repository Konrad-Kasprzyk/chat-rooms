import ArchivedUser from "common/types/history/archivedUser.type";
import DocRecord from "common/types/history/docRecord.type";
import ModelRecord from "common/types/history/modelRecord.type";
import User from "../user.model";
import Workspace from "../workspace.model";
import HistoryModelSchema from "./historyModelSchema.interface";

/**
 * Stores information about adding and removing users from the workspace.
 * Stores information about inviting users and cancelling user invitations.
 */
export default interface UsersHistory extends HistoryModelSchema {
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
   * The history records are sorted from oldest to newest.
   */
  history: (
    | ModelRecord<Workspace, "invitedUserEmails", string>
    | ModelRecord<Workspace, "users", User>
    | DocRecord<"allInvitationsCancel", string[]>
    | DocRecord<"userRemovedFromWorkspace", ArchivedUser>
  )[];
  historyRecordsCount: number;
  modificationTime: Date;
  /**
   * Use it to check the date when the document was put into the IndexedDB.
   */
  fetchingFromSeverTime: Date;
  hasOfflineChanges: boolean;
}
