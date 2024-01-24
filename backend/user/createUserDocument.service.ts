import USER_DTO_INIT_VALUES from "backend/constants/docsInitValues/userDTOInitValues.constant";
import USER_DETAILS_DTO_INIT_VALUES from "backend/constants/docsInitValues/userDetailsDTOInitValues.constant";
import adminCollections from "backend/db/adminCollections.firebase";
import adminDb from "backend/db/adminDb.firebase";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
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
  email: string,
  collections: typeof adminCollections = adminCollections
): Promise<string> {
  if (!uid) throw new ApiError(400, "The user id is required to be a non-empty string.");
  if (!email) throw new ApiError(400, "The email is required to be a non-empty string.");
  const batch = adminDb.batch();
  const linkedUserDocumentIds: string[] = [uid];
  for (let i = 0; i < USER_BOTS_COUNT; i++) linkedUserDocumentIds.push(uid + `bot${i}`);
  const userRef = collections.users.doc(uid);
  const userModel: UserDTO = {
    ...USER_DTO_INIT_VALUES,
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
  const userDetailsModel: UserDetailsDTO = {
    ...USER_DETAILS_DTO_INIT_VALUES,
    ...{
      id: uid,
    },
  };
  batch.create(userDetailsRef, userDetailsModel);
  for (let i = 0; i < USER_BOTS_COUNT; i++) {
    const botId = uid + `bot${i}`;
    const botUserRef = collections.users.doc(botId);
    const botUserModel: UserDTO = {
      ...USER_DTO_INIT_VALUES,
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
    const botUserDetailsModel: UserDetailsDTO = {
      ...USER_DETAILS_DTO_INIT_VALUES,
      ...{
        id: botId,
      },
    };
    batch.create(botUserDetailsRef, botUserDetailsModel);
  }
  await batch.commit();
  return uid;
}
