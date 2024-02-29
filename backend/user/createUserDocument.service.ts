import USER_DTO_INIT_VALUES from "backend/constants/docsInitValues/userDTOInitValues.constant";
import USER_DETAILS_DTO_INIT_VALUES from "backend/constants/docsInitValues/userDetailsDTOInitValues.constant";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import EMAIL_SUFFIX from "common/constants/emailSuffix.constant";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
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
  email?: string,
  collections: typeof adminCollections = adminCollections
): Promise<string> {
  if (!uid) throw new ApiError(400, "The user id is required to be a non-empty string.");
  if (!username) throw new ApiError(400, "The username is required to be a non-empty string.");
  const userEmail = email || `${uid}${EMAIL_SUFFIX}`;
  const batch = adminDb.batch();
  const linkedUserDocumentIds: string[] = [uid];
  for (let i = 0; i < USER_BOTS_COUNT; i++) linkedUserDocumentIds.push(`bot${i}` + uid);
  const userRef = collections.users.doc(uid);
  const userModel: UserDTO = {
    ...USER_DTO_INIT_VALUES,
    ...{
      id: uid,
      email: userEmail,
      username,
      isBotUserDocument: false,
    },
  };
  batch.create(userRef, userModel);
  const userDetailsRef = collections.userDetails.doc(uid);
  const userDetailsModel: UserDetailsDTO = {
    ...USER_DETAILS_DTO_INIT_VALUES,
    ...{
      id: uid,
      linkedUserDocumentIds,
      mainUserId: uid,
      botNumber: null,
    },
  };
  batch.create(userDetailsRef, userDetailsModel);
  for (let i = 0; i < USER_BOTS_COUNT; i++) {
    const botId = `bot${i}` + uid;
    const botUserRef = collections.users.doc(botId);
    const botUserModel: UserDTO = {
      ...USER_DTO_INIT_VALUES,
      ...{
        id: botId,
        email: `${botId}${EMAIL_SUFFIX}`,
        username: `#${i + 1} ${username}`,
        isBotUserDocument: true,
      },
    };
    batch.create(botUserRef, botUserModel);
    const botUserDetailsRef = collections.userDetails.doc(botId);
    const botUserDetailsModel: UserDetailsDTO = {
      ...USER_DETAILS_DTO_INIT_VALUES,
      ...{
        id: botId,
        linkedUserDocumentIds,
        mainUserId: uid,
        botNumber: i,
      },
    };
    batch.create(botUserDetailsRef, botUserDetailsModel);
  }
  await batch.commit();
  return uid;
}
