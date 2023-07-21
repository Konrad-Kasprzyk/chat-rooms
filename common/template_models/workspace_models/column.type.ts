import { Timestamp } from "firebase/firestore";
import typia from "typia";

export default interface Column {
  /**
   * @minLength 1
   */
  id: string;
  name: string;
  taskFinishColumn: boolean;
  /**
   * @minLength 1
   */
  replacedByColumnId: string | null;
  inRecycleBin: boolean;
  placingInBinTime: Timestamp | null;
  /**
   * @minLength 1
   */
  insertedIntoBinByUserId: string | null;
}

export const validateColumn = typia.createValidateEquals<Column>();
