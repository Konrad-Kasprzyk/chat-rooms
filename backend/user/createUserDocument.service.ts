import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import USER_DETAILS_INIT_VALUES from "common/constants/docsInitValues/userDetailsInitValues.constant";
import USER_INIT_VALUES from "common/constants/docsInitValues/userInitValues.constant";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import User from "common/models/user.model";
import UserDetails from "common/models/userDetails.model";
import ApiError from "common/types/apiError.class";

/**
 * Creates a user document with a userDetails document. Creates the user's bot documents.
 * @returns A promise that resolves to the created user document id.
 * @throws {ApiError} When the provided uid or email is empty.
 * When the user document with the provided uid already exists.
 */
export default async function createUserDocument(
  uid: string,
  username: string,
  email: string,
  collections: typeof adminCollections = adminCollections
): Promise<string> {
  if (!uid) throw new ApiError(400, "The user id is required to be a non-empty string.");
  if (!email) throw new ApiError(400, "The email is required to be a non-empty string.");
  const batch = adminDb.batch();
  const linkedUserDocumentIds: string[] = [uid];
  for (let i = 0; i < USER_BOTS_COUNT; i++) linkedUserDocumentIds.push(uid + `bot${i}`);
  const userRef = collections.users.doc(uid);
  const userModel: User = {
    ...USER_INIT_VALUES,
    ...{
      id: uid,
      email,
      username,
      linkedUserDocumentIds,
      isBotUserDocument: false,
    },
  };
  batch.create(userRef, userModel);
  const userDetailsRef = collections.userDetails.doc(uid);
  const userDetailsModel: UserDetails = {
    ...USER_DETAILS_INIT_VALUES,
    ...{
      id: uid,
    },
  };
  batch.create(userDetailsRef, userDetailsModel);
  for (let i = 0; i < USER_BOTS_COUNT; i++) {
    const botId = uid + `bot${i}`;
    const botUserRef = collections.users.doc(botId);
    const botUserModel: User = {
      ...USER_INIT_VALUES,
      ...{
        id: botId,
        email: email.split("@").join(`@taskKeeperBot${i}.`),
        username: `bot-${i} ${username}`,
        linkedUserDocumentIds,
        isBotUserDocument: true,
      },
    };
    batch.create(botUserRef, botUserModel);
    const botUserDetailsRef = collections.userDetails.doc(botId);
    const botUserDetailsModel: UserDetails = {
      ...USER_DETAILS_INIT_VALUES,
      ...{
        id: botId,
      },
    };
    batch.create(botUserDetailsRef, botUserDetailsModel);
  }
  await batch.commit();
  return uid;
}
