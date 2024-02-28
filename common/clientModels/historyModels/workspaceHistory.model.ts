import ModelRecord from "common/types/history/modelRecord.type";
import Workspace from "../workspace.model";
import HistoryModelSchema from "./historyModelSchema.interface";

/**
 * Stores who created the workspace. Stores information about changing the title and description
 * of the workspace. Stores information about putting and restoring workspace from the recycle bin.
 */
export default interface WorkspaceHistory extends HistoryModelSchema {
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
    | ModelRecord<Workspace, "title" | "description", string>
    | ModelRecord<Workspace, "creationTime" | "placingInBinTime", Date>
  )[];
  historyRecordsCount: number;
  modificationTime: Date;
  /**
   * Use it to check the date when the document was put into the IndexedDB.
   */
  fetchingFromSeverTime: Date;
  hasOfflineChanges: boolean;
}
