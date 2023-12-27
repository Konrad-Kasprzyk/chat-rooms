import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

const WORKSPACE_SUMMARY_INIT_VALUES: Omit<
  WorkspaceSummary,
  "id" | "url" | "title" | "description" | "userIds"
> = {
  invitedUserEmails: [],
  modificationTime: FieldValue.serverTimestamp() as Timestamp,
  creationTime: FieldValue.serverTimestamp() as Timestamp,
  isInBin: false,
  placingInBinTime: null,
  insertedIntoBinByUserId: null,
  isDeleted: false,
  deletionTime: null,
};

export default WORKSPACE_SUMMARY_INIT_VALUES;
