import { signInWithEmailAndPassword } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../../db/firebase";
import { adminAuth, adminDb } from "../../../db/firebase-admin";
import COLLECTIONS from "../../constants/collections";

export function getUniqueEmail() {
  return uuidv4() + "@normkeeper-testing.api";
}

export function getRandomPassword() {
  return uuidv4();
}

/**
 * This function signs in a user with their email and password and returns their ID token.
 * @returns a Promise that resolves to a string, which is the ID token of the currently signed-in user.
 * @throws {string} When the provided email or password is empty.
 */
export async function signInEmailPasswordAndGetIdToken(
  email: string,
  password: string
): Promise<string> {
  await signInWithEmailAndPassword(auth, email, password);
  if (!auth.currentUser) throw "Current user not found after signing in with email and password.";
  return auth.currentUser.getIdToken();
}

/**
 * This function registers a user with an email, password, and username using Firebase authentication.
 * @param {string} username - The username parameter is a string that represents the display name of
 * the user being registered.
 * @returns a Promise that resolves to the UID (user ID) of the newly created user.
 * @throws {string} When the provided email or password is empty.
 */
export async function registerUserEmailPassword(email: string, password: string, username: string) {
  if (!email) throw "Email missing.";
  if (!password) throw "Password missing.";
  return adminAuth
    .createUser({
      email: email,
      emailVerified: false,
      password: password,
      displayName: username,
    })
    .then((userRecord) => {
      return userRecord.uid;
    });
}

/**
 * This function deletes registered users and their associated documents based on their email
 * addresses.
 * @param {string[]} usersEmails - an array of strings representing the email addresses of the users to
 * be deleted.
 */
export async function deleteRegisteredUsersAndUserDocuments(usersEmails: string[]) {
  const promises: Promise<void>[] = [];
  for (const email of usersEmails) {
    const user = await adminAuth.getUserByEmail(email).catch(() => null);
    if (!user) {
      promises.push(
        adminDb
          .collection(COLLECTIONS.users)
          .where("email", "==", email)
          .count()
          .get()
          .then((userDocsCount) => {
            if (userDocsCount.data().count > 0)
              throw (
                "User with email " +
                email +
                " is not registered, but has an existing user document."
              );
          })
      );
      continue;
    }
    const userRef = adminDb.collection(COLLECTIONS.users).doc(user.uid);
    promises.push(adminDb.recursiveDelete(userRef));
    promises.push(adminAuth.deleteUser(user.uid));
  }
  await Promise.all(promises);
}
