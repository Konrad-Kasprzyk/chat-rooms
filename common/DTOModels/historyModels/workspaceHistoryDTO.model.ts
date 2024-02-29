import DTOModelRecord from "common/types/history/DTOModelRecord.type";
import type { Timestamp } from "firebase-admin/firestore";
import WorkspaceDTO from "../workspaceDTO.model";
import HistoryModelDTOSchema from "./historyModelDTOSchema.interface";

/**
 * Stores who created the workspace. Stores information about changing the title and description
 * of the workspace. Stores information about putting and restoring workspace from the recycle bin.
 */
export default interface WorkspaceHistoryDTO extends HistoryModelDTOSchema {
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
      | DTOModelRecord<WorkspaceDTO, "title" | "description", string>
      | DTOModelRecord<WorkspaceDTO, "creationTime" | "placingInBinTime", Timestamp>;
  };
  historyRecordsCount: number;
  modificationTime: Timestamp;
}
