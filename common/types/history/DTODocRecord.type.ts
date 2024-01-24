import { Timestamp } from "firebase-admin/firestore";

/**
 * These changes means:
 * {oldValue: null; value: foo} -> created with foo.
 * {oldValue: foo; value: bar} -> changed from foo to bar.
 * {oldValue: foo; value: null} -> field with foo deleted.
 */
type DTODocRecord<Action extends string, Value> = {
  action: Action;
  /**
   * May be the id of a deleted user. The client will check if the user belongs to the workspace,
   * if not, the client will not display the user who performed an action.
   * @minLength 1
   */
  userId: string;
  date: Timestamp;
  oldValue: Value | null;
  value: Value | null;
};

export default DTODocRecord;
