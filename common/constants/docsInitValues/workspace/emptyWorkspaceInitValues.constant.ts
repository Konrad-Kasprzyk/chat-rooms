import Workspace from "common/models/workspace_models/workspace.model";
import COLUMNS_INIT_VALUES from "./columnsInitValues.constant";
import LABELS_INIT_VALUES from "./labelsInitValues.constant";

const EMPTY_WORKSPACE_INIT_VALUES: Omit<
  Workspace,
  "id" | "url" | "description" | "title" | "userIds" | "counterId"
> = {
  invitedUserIds: [],
  columns: COLUMNS_INIT_VALUES,
  labels: LABELS_INIT_VALUES,
  hasItemsInBin: false,
  // historyId: "",
  placingInBinTime: null,
  inRecycleBin: false,
  insertedIntoBinByUserId: null,
};

export default EMPTY_WORKSPACE_INIT_VALUES;
