import Goal from "common/clientModels/goal.model";
import User from "common/clientModels/user.model";
import Column from "../column.type";
import Label from "../label.type";

/**
 * These changes means:
 * {oldValue: null; value: foo} -> created with foo.
 * {oldValue: foo; value: bar} -> changed from foo to bar.
 * {oldValue: foo; value: null} -> field with foo deleted.
 */
type DocRecord<Action extends string, Value> = {
  action: Action;
  /**
   * If the id of the user who performed the action does not belong to the workspace,
   * the user who performed the action is set to null.
   */
  user: User | null;
  /**
   * May no longer belong to the workspace.
   * @minLength 1
   */
  userId: string;
  date: Date;
  /**
   * Can also be an id of the held document/object.
   */
  oldValue: Value extends User | Column | Label | Goal ? Value | string | null : Value | null;
  /**
   * Can also be an id of the held document/object.
   */
  value: Value extends User | Column | Label | Goal ? Value | string | null : Value | null;
};

export default DocRecord;
