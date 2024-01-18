import User from "common/models/user.model";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

const USER_INIT_VALUES: Omit<
  User,
  "id" | "email" | "username" | "isBotUserDocument" | "linkedUserDocumentIds"
> = {
  workspaceIds: [],
  workspaceInvitationIds: [],
  dataFromFirebaseAccount: false,
  modificationTime: FieldValue.serverTimestamp() as Timestamp,
  isDeleted: false,
};

export default USER_INIT_VALUES;
