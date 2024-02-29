import UserDTO from "common/DTOModels/userDTO.model";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const USER_DTO_INIT_VALUES: Omit<UserDTO, "id" | "email" | "username" | "isBotUserDocument"> = {
  workspaceIds: [],
  workspaceInvitationIds: [],
  modificationTime: FieldValue.serverTimestamp() as Timestamp,
  isDeleted: false,
  deletionTime: null,
};

export default USER_DTO_INIT_VALUES;
