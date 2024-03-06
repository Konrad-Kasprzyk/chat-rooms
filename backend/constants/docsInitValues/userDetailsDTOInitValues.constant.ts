import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";

const USER_DETAILS_DTO_INIT_VALUES: Omit<
  UserDetailsDTO,
  "id" | "linkedUserDocumentIds" | "mainUserId" | "botNumber"
> = {
  hiddenWorkspaceInvitationIds: [],
  allLinkedUserBelongingWorkspaceIds: [],
};

export default USER_DETAILS_DTO_INIT_VALUES;
