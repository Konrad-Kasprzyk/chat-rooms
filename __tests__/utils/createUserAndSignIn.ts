import { adminAuth } from "../../db/firebase-admin";
import { auth } from "../../db/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserRecord } from "firebase-admin/lib/auth/user-record";

export default async function createUserAndSignIn(filename: string): Promise<UserRecord> {
  const dateTime = new Date().toISOString().replaceAll(":", ".");
  const userEmail = `${filename}${dateTime}@normkeeper-testing.api`;
  const userPassword = "admin1";
  const user = await adminAuth.createUser({
    email: userEmail,
    password: userPassword,
    displayName: "BOT testing",
    uid: userEmail,
  });
  await signInWithEmailAndPassword(auth, userEmail, userPassword).catch((error: any) => {
    console.error(error.code);
    console.error(error.message);
  });
  return user;
}
