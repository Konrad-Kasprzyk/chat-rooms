import { Timestamp } from "firebase/firestore";

type statsFilters = {
  workspaceId: string;
  latestTaskCompleteDate?: Timestamp;
};

export default statsFilters;
