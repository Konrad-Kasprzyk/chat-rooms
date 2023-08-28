import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

const WORKSPACE_SUMMARY_INIT_VALUES: Omit<
  WorkspaceSummary,
  "id" | "url" | "title" | "description"
> = {
  summaryModificationTime: FieldValue.serverTimestamp() as Timestamp,
  placingInBinTime: null,
};

export default WORKSPACE_SUMMARY_INIT_VALUES;
