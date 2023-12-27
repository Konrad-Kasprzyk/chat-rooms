import User from "common/models/user.model";
import { FieldValue } from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";

const USER_INIT_VALUES: Omit<User, "id" | "email" | "username"> = {
  workspaceIds: [],
  workspaceInvitationIds: [],
  modificationTime: FieldValue.serverTimestamp() as Timestamp,
  isDeleted: false,
  deletionTime: null,
};

export default USER_INIT_VALUES;
