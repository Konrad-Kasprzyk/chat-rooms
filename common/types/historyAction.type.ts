import { Timestamp } from "firebase/firestore";

/**
 * These changes means:
 * oldValue: null; newValue: foo -> created with foo
 * oldValue: foo; newValue: bar -> changed from foo to bar
 * oldValue: foo; newValue: null -> field with foo deleted
 */
type HistoryAction<A extends string, T> = {
  action: A;
  /**
   * @minLength 1
   */
  actionMakerId: string;
  date: Timestamp;
  oldValue: T | null;
  newValue: T | null;
};

export default HistoryAction;
