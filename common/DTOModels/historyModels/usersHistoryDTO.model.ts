import DTODocRecord from "common/types/history/DTODocRecord.type";
import DTOModelRecord from "common/types/history/DTOModelRecord.type";
import ArchivedUser from "common/types/history/archivedUser.type";
import type { Timestamp } from "firebase-admin/firestore";
import WorkspaceDTO from "../workspaceDTO.model";
import HistoryModelDTOSchema from "./historyModelDTOSchema.interface";

/**
 * Stores information about adding and removing users from the workspace.
 * Stores information about inviting users and cancelling user invitations.
 */
export default interface UsersHistoryDTO extends HistoryModelDTOSchema {
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
   * The history records are sorted from oldest to newest. Their key is an index as in an array
   * 0, 1, 2... Must use a map instead of an array because the firestore does not support the
   * server timestamp inside an array.
   */
  history: {
    [index in string]:
      | DTOModelRecord<WorkspaceDTO, "userIds" | "invitedUserEmails", string>
      | DTODocRecord<"allInvitationsCancel", string[]>
      | DTODocRecord<"userRemovedFromWorkspace", ArchivedUser>;
  };
  historyRecordsCount: number;
  modificationTime: Timestamp;
}
