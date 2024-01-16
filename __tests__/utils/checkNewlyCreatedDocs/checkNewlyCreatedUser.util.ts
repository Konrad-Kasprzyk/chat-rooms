import adminCollections from "backend/db/adminCollections.firebase";
import USER_DETAILS_INIT_VALUES from "common/constants/docsInitValues/userDetailsInitValues.constant";
import USER_INIT_VALUES from "common/constants/docsInitValues/userInitValues.constant";
import validateUser from "common/model_validators/validateUser.util";
import validateUserDetails from "common/model_validators/validateUserDetails.util";
import checkInitValues from "./checkInitValues.util";

/**
 * Ensures that the user and user details documents have been created correctly for
 * the provided user id. Use only if the user is not invited and does not belong to any workspace.
 * Checks if the documents have initial values.
 * @throws {Error} If any of the documents to check the initial values are not found.
 */
export default async function checkNewlyCreatedUser(
  uid: string,
  expectedEmail?: string,
  expectedUsername?: string
) {
  const user = (await adminCollections.users.doc(uid).get()).data();
  if (!user) throw new Error("User document to check the initial values not found.");
  validateUser(user);
  checkInitValues(user, USER_INIT_VALUES);
  expect(user.id).toEqual(uid);
  expect(user.modificationTime.toDate() <= new Date()).toBeTrue();
  if (expectedEmail) expect(user.email).toEqual(expectedEmail);
  if (expectedUsername) expect(user.username).toEqual(expectedUsername);

  const userDetails = (await adminCollections.userDetails.doc(uid).get()).data();
  if (!userDetails) throw new Error("User details document to check the initial values not found.");
  validateUserDetails(userDetails);
  checkInitValues(userDetails, USER_DETAILS_INIT_VALUES);
  expect(userDetails.id).toEqual(uid);
}
