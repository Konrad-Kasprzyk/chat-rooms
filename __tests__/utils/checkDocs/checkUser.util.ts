import USER_INIT_VALUES from "common/constants/docsInitValues/userInitValues.constant";
import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import validateUser from "common/model_validators/validateUser.util";
import { doc, getDoc } from "firebase/firestore";
import checkInitValues from "./checkInitValues.util";

/**
 * Asserts that new user documents were created properly for an actually signed in user.
 * @throws {string} When the user is not signed in
 */
export default async function checkUser(
  expectedUid: string,
  expectedEmail: string,
  expectedUsername: string
) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User is not signed in.");
  const userRef = doc(collections.users, uid);
  const user = (await getDoc(userRef)).data()!;
  validateUser(user);
  expect(user.id).toEqual(expectedUid);
  expect(user.email).toEqual(expectedEmail);
  expect(user.username).toEqual(expectedUsername);
  expect(user.modificationTime.toDate() <= new Date()).toBeTrue();

  checkInitValues(user, USER_INIT_VALUES);

  // if (matchInitValues) {
  //   for (const key of Object.keys(USER_INIT_VALUES) as (keyof typeof USER_INIT_VALUES)[]) {
  //     expect(user[key]).toStrictEqual(USER_INIT_VALUES[key]);
  //   }
  // }
}
