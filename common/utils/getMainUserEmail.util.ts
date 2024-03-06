import auth from "client/db/auth.firebase";
import getBotEmail from "./getBotEmail.util";

export default function getMainUserEmail(mainUserId: string) {
  return auth.currentUser?.email || getBotEmail(mainUserId);
}
