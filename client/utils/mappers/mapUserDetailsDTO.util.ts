import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import UserDetails from "common/clientModels/userDetails.model";

export default function mapUserDetailsDTO(userDetailsDTO: UserDetailsDTO): UserDetails {
  const mappedUserDetails: UserDetails & Partial<UserDetailsDTO> = { ...userDetailsDTO };
  delete mappedUserDetails.allLinkedUserBelongingWorkspaceIds;
  delete mappedUserDetails.isDeleted;
  return mappedUserDetails;
}
