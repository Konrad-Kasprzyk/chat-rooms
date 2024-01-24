import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";

const USER_DETAILS_DTO_INIT_VALUES: Omit<UserDetailsDTO, "id"> = {
  hiddenWorkspaceInvitationIds: [],
  isDeleted: false,
};

export default USER_DETAILS_DTO_INIT_VALUES;
