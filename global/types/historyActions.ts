import { Timestamp } from "firebase/firestore";

/**
 * These values changes mean:
 * oldValue: null; newValue: foo -> created with foo
 * oldValue: foo; newValue: bar -> changed from foo to bar
 * oldValue: foo; newValue: null -> field with foo deleted
 *
 * Actions with "index" in name hold swapped texts instead of indexes (numbers)
 * for example instead of 1 <-> 3 holds subtasks[1] <-> subtasks[3]
 */
type historyAction<A extends string, T> = {
  action: A;
  userId: string;
  date: Timestamp;
  oldValue: T | null;
  newValue: T | null;
};

export default historyAction;
