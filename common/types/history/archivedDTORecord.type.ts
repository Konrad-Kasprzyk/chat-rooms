import { Timestamp } from "firebase-admin/firestore";
import ArchivedGoal from "./archivedGoal.type";
import ArchivedTask from "./archivedTask.type";
import ArchivedUser from "./archivedUser.type";

/**
 * Stores permanently deleted document or user who left the workspace.
 */
type ArchivedDTORecord<
  Action extends "docDeleted" | "userRemovedFromWorkspace",
  Value extends Action extends "docDeleted" ? ArchivedTask | ArchivedGoal : ArchivedUser
> = {
  action: Action;
  /**
   * The id of the user who deleted the document or removed another user from the workspace.
   * Could be the id of a deleted user. The client will check if the user belongs to the workspace,
   * if not, the client will not display the user who performed the action.
   * If the action was not performed by a script, the user id is set to null.
   * @minLength 1
   */
  userId: string | null;
  date: Timestamp;
  value: Value;
};

export default ArchivedDTORecord;
