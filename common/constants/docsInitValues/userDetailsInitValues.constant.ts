import UserDetails from "common/models/userDetails.model";

const USER_DETAILS_INIT_VALUES: Omit<UserDetails, "id"> = {
  hiddenWorkspaceInvitationsIds: [],
};

export default USER_DETAILS_INIT_VALUES;
