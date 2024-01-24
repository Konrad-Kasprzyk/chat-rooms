import UserDTO from "common/DTOModels/userDTO.model";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const USER_DTO_INIT_VALUES: Omit<
  UserDTO,
  "id" | "email" | "username" | "isBotUserDocument" | "linkedUserDocumentIds"
> = {
  workspaceIds: [],
  workspaceInvitationIds: [],
  dataFromFirebaseAccount: false,
  modificationTime: FieldValue.serverTimestamp() as Timestamp,
  isDeleted: false,
};

export default USER_DTO_INIT_VALUES;
