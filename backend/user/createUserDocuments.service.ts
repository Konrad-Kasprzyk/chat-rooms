import USER_DTO_INIT_VALUES from "backend/constants/docsInitValues/userDTOInitValues.constant";
import USER_DETAILS_DTO_INIT_VALUES from "backend/constants/docsInitValues/userDetailsDTOInitValues.constant";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import USER_BOTS_COUNT from "common/constants/userBotsCount.constant";
import ApiError from "common/types/apiError.class";
import getBotEmail from "common/utils/getBotEmail.util";
import getBotId from "common/utils/getBotId.util";
import getBotUsername from "common/utils/getBotUsername.util";

/**
 * Creates a user document with a userDetails document. Creates the user's bot documents.
 * Does nothing if the user document with the provided uid already exists
 * @param email If not provided, the fake email will be created from the user id and the user
 * will be marked as an anonymous user.
 * @returns A promise that resolves to the created user document id.
 * @throws {ApiError} When the provided uid or email is empty.
 */
export default async function createUserDocuments(
  uid: string,
  username: string,
  email?: string,
  collections: typeof adminCollections = adminCollections
): Promise<string> {
  if (!uid) throw new ApiError(400, "The user id is required to be a non-empty string.");
  if (!username) throw new ApiError(400, "The username is required to be a non-empty string.");
  const userDocSnap = await collections.users.doc(uid).get();
  if (userDocSnap.exists) return uid;
  const userEmail = email || getBotEmail(uid);
  const batch = adminDb.batch();
  const linkedUserDocumentIds: string[] = [uid];
  for (let i = 0; i < USER_BOTS_COUNT; i++) linkedUserDocumentIds.push(getBotId(uid, i));
  const userRef = collections.users.doc(uid);
  const userModel: UserDTO = {
    ...USER_DTO_INIT_VALUES,
    ...{
      id: uid,
      email: userEmail,
      username,
      isBotUserDocument: false,
      isAnonymousAccount: email ? false : true,
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
    const botId = getBotId(uid, i);
    const botUserRef = collections.users.doc(botId);
    const botUserModel: UserDTO = {
      ...USER_DTO_INIT_VALUES,
      ...{
        id: botId,
        email: getBotEmail(botId),
        username: getBotUsername(username, i),
        isBotUserDocument: true,
        isAnonymousAccount: email ? false : true,
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
