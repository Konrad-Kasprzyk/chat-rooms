import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import COLUMNS_INIT_VALUES from "./columnsInitValues.constant";
import LABELS_INIT_VALUES from "./labelsInitValues.constant";

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
  columns: COLUMNS_INIT_VALUES,
  labels: LABELS_INIT_VALUES,
  modificationTime: FieldValue.serverTimestamp() as Timestamp,
  creationTime: FieldValue.serverTimestamp() as Timestamp,
  isInBin: false,
  placingInBinTime: null,
  isDeleted: false,
  deletionTime: null,
};

export default WORKSPACE_DTO_INIT_VALUES;
