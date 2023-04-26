import { Timestamp } from "firebase/firestore";

/**
 * These changes means:
 * oldValue: null; newValue: foo -> created with foo
 * oldValue: foo; newValue: bar -> changed from foo to bar
 * oldValue: foo; newValue: null -> field with foo deleted
 */
type historyAction<A extends string, T> = {
  action: A;
  actionMakerId: string;
  date: Timestamp;
  oldValue: T | null;
  newValue: T | null;
};

export default historyAction;
