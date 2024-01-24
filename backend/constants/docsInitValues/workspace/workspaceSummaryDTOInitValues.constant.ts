import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const WORKSPACE_SUMMARY_DTO_INIT_VALUES: Omit<
  WorkspaceSummaryDTO,
  "id" | "url" | "title" | "description" | "userIds"
> = {
  invitedUserIds: [],
  modificationTime: FieldValue.serverTimestamp() as Timestamp,
  creationTime: FieldValue.serverTimestamp() as Timestamp,
  isInBin: false,
  placingInBinTime: null,
  isDeleted: false,
};

export default WORKSPACE_SUMMARY_DTO_INIT_VALUES;
