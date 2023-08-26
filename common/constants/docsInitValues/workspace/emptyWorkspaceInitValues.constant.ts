import Workspace from "common/models/workspace_models/workspace.model";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import COLUMNS_INIT_VALUES from "./columnsInitValues.constant";
import LABELS_INIT_VALUES from "./labelsInitValues.constant";

const EMPTY_WORKSPACE_INIT_VALUES: Omit<
  Workspace,
  "id" | "url" | "title" | "description" | "userIds"
> = {
  invitedUserIds: [],
  columns: COLUMNS_INIT_VALUES,
  labels: LABELS_INIT_VALUES,
  hasItemsInBin: false,
  modificationTime: FieldValue.serverTimestamp() as Timestamp,
  creationTime: FieldValue.serverTimestamp() as Timestamp,
  // historyId: "",
  placingInBinTime: null,
  insertedIntoBinByUserId: null,
};

export default EMPTY_WORKSPACE_INIT_VALUES;
