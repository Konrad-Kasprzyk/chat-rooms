import ModelRecord from "common/types/history/modelRecord.type";
import Workspace from "../workspace.model";

/**
 * Stores who created the workspace. Stores information about changing the title and description
 * of the workspace. Stores information about putting and restoring workspace from the recycle bin.
 */
export default interface WorkspaceHistory {
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
    | ModelRecord<Workspace, "title" | "description", string>
    | ModelRecord<Workspace, "creationTime" | "placingInBinTime", Date>
  )[];
  modificationTime: Date;
}
