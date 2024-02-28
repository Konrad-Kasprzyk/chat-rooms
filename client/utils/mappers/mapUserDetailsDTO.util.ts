import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import UserDetails from "common/clientModels/userDetails.model";

export default function mapUserDetailsDTO(userDetailsDTO: UserDetailsDTO): UserDetails {
  const mappedUserDetails: UserDetails & Partial<Omit<UserDetailsDTO, keyof UserDetails>> = {
    ...userDetailsDTO,
    fetchingFromSeverTime: new Date(),
    hasOfflineChanges: false,
  };
  delete mappedUserDetails.allLinkedUserBelongingWorkspaceIds;
  delete mappedUserDetails.isDeleted;
  return mappedUserDetails;
}
