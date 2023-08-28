import User from "common/models/user.model";

const USER_INIT_VALUES: Omit<User, "id" | "email" | "username"> = {
  workspaceIds: [],
  workspaceInvitationIds: [],
};

export default USER_INIT_VALUES;
