import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const WORKSPACE_DTO_INIT_VALUES: Omit<
  WorkspaceDTO,
  | "id"
  | "url"
  | "title"
  | "description"
  | "userIds"
  | "newestWorkspaceHistoryId"
  | "newestUsersHistoryId"
  | "newestColumnsHistoryId"
  | "newestLabelsHistoryId"
  | "newestArchivedGoalsId"
  | "newestArchivedTasksId"
> = {
  invitedUserEmails: [],
  modificationTime: FieldValue.serverTimestamp() as Timestamp,
  creationTime: FieldValue.serverTimestamp() as Timestamp,
  isInBin: false,
  placingInBinTime: null,
  isDeleted: false,
  deletionTime: null,
};

export default WORKSPACE_DTO_INIT_VALUES;
