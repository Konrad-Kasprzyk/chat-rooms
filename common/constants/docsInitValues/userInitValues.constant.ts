import User from "common/models/user.model";

const USER_INIT_VALUES: Omit<User, "id" | "shortId" | "email" | "username"> = {
  workspaces: [],
  workspaceIds: [],
  workspaceInvitations: [],
  workspaceInvitationIds: [],
};

export default USER_INIT_VALUES;