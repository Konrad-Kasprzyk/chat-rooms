import UserDTO from "common/DTOModels/userDTO.model";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const USER_DTO_INIT_VALUES: Omit<
  UserDTO,
  "id" | "email" | "username" | "isBotUserDocument" | "isAnonymousAccount"
> = {
  workspaceIds: [],
  workspaceInvitationIds: [],
  modificationTime: FieldValue.serverTimestamp() as Timestamp,
};

export default USER_DTO_INIT_VALUES;
