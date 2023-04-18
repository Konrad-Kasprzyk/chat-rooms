import { Timestamp } from "firebase/firestore";

type normFilters = {
  workspaceId: string;
  normsEndBeforeDate?: Timestamp;
};

export default normFilters;
