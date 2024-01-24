import DTOModelRecord from "common/types/history/DTOModelRecord.type";
import type { Timestamp } from "firebase-admin/firestore";
import WorkspaceDTO from "../workspaceDTO.model";

/**
 * Stores who created the workspace. Stores information about changing the title and description
 * of the workspace. Stores information about putting and restoring workspace from the recycle bin.
 */
export default interface WorkspaceHistoryDTO {
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
    | DTOModelRecord<WorkspaceDTO, "title" | "description", string>
    | DTOModelRecord<WorkspaceDTO, "creationTime" | "placingInBinTime", Timestamp>
  )[];
  modificationTime: Timestamp;
}
