import { Timestamp } from "firebase/firestore";

export default interface completedTaskStatsChunk {
  id: string;
  projectId: string;
  earliestTaskFinishDate: Timestamp;
  latestTaskFinishDate: Timestamp;
  taskStats: {
    // task short id
    i: string;
    // finish time - completion time
    f: Timestamp;
    // label short ids
    l: string[];
    // goal short id
    g: string;
    // creator - author short id
    c: string | null;
    // assigned user short id
    a: string | null;
    // story points
    s: number;
    // priority - low, normal, high, urgent
    p: "l" | "n" | "h" | "u";
  }[];
}
