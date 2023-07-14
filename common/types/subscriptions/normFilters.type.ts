import { Timestamp } from "firebase/firestore";

type NormFilters = {
  workspaceId: string;
  normsEndBeforeDate?: Timestamp;
};

export default NormFilters;
