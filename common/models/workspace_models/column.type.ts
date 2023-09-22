import { Timestamp } from "firebase/firestore";

export default interface Column {
  /**
   * Used in url, is an integer.
   * @minLength 1
   */
  id: string;
  name: string;
  completedTasksColumn: boolean;
  /**
   * @minLength 1
   */
  replacedByColumnId: string | null;
  isInBin: boolean;
  placingInBinTime: Timestamp | null;
  /**
   * @minLength 1
   */
  insertedIntoBinByUserId: string | null;
}
