import DTOModelRecord from "common/types/history/DTOModelRecord.type";
import ArchivedDTORecord from "common/types/history/archivedDTORecord.type";
import ArchivedUser from "common/types/history/archivedUser.type";
import type { Timestamp } from "firebase-admin/firestore";
import WorkspaceDTO from "../workspaceDTO.model";

/**
 * Stores information about adding and removing users from the workspace.
 * Stores information about inviting users and cancelling user invitations.
 */
export default interface UsersHistoryDTO {
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
    | DTOModelRecord<WorkspaceDTO, "userIds" | "invitedUserEmails", string>
    | ArchivedDTORecord<"userRemovedFromWorkspace", ArchivedUser>
  )[];
  modificationTime: Timestamp;
}
