import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import User from "common/clientModels/user.model";
import UserDetails from "common/clientModels/userDetails.model";
import Workspace from "common/clientModels/workspace.model";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";

type AllClientModels =
  | UsersHistory
  | WorkspaceHistory
  | User
  | UserDetails
  | Workspace
  | WorkspaceSummary;

export default AllClientModels;
