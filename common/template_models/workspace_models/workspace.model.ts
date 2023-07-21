import MIN_COLUMN_COUNT from "common/constants/minColumnCount.constant";
import Column from "common/models/workspace_models/column.type";
import Label from "common/models/workspace_models/label.type";
import { Timestamp } from "firebase/firestore";
import typia from "typia";

export default interface Workspace {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * In addition to being an url, it is also an id of WorkspaceUrl.
   * @minLength 1
   */
  url: string;
  /**
   * @minLength 1
   */
  title: string;
  description: string;
  /**
   * @minLength 1
   */
  userIds: string[];
  /**
   * @minLength 1
   */
  invitedUserIds: string[];
  /**
   * @minItems 2
   */
  columns: Column[];
  labels: Label[];
  /**
   * @minLength 1
   */
  counterId: string;
  hasItemsInBin: boolean;
  // /**
  //  * @minLength 1
  //  */
  // historyId: string;
  inRecycleBin: boolean;
  placingInBinTime: Timestamp | null;
  /**
   * @minLength 1
   */
  insertedIntoBinByUserId: string | null;
}

/**
 * Assert that hardcoded '@minItems 2' used in columns property of Workspace is valid.
 * Used number '2' should equal MIN_COLUMN_COUNT constant.
 */
typia.assert<{ MIN_COLUMN_COUNT: 2 }>({ MIN_COLUMN_COUNT });

export const validateWorkspace = typia.createValidateEquals<Workspace>();
