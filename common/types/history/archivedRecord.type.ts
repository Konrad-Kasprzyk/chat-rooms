import User from "common/clientModels/user.model";
import ArchivedGoal from "./archivedGoal.type";
import ArchivedTask from "./archivedTask.type";
import ArchivedUser from "./archivedUser.type";

/**
 * Stores permanently deleted document or user who left the workspace.
 */
type ArchivedRecord<
  Action extends "docDeleted" | "userRemovedFromWorkspace",
  Value extends Action extends "docDeleted" ? ArchivedTask | ArchivedGoal : ArchivedUser
> = {
  action: Action;
  /**
   * If the id of the user who deleted a document or removed another user from the workspace
   * does not belong to the workspace or the action was performed by a script, the user who
   * performed the action is set to null.
   */
  user: User | null;
  /**
   * The user who deleted the document or removed another user from the workspace may no longer
   * belong to the workspace. If the action was not performed by a script, the user id is set to null.
   * @minLength 1
   */
  userId: string | null;
  date: Date;
  value: Value;
};

export default ArchivedRecord;
