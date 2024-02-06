import listenOpenWorkspace from "clientApi/workspace/listenOpenWorkspace.api";
import { setOpenWorkspaceId } from "clientApi/workspace/openWorkspaceId.utils";
import { firstValueFrom } from "rxjs";
import listenCurrentUserDetails from "./listenCurrentUserDetails.api";
import { _setSignedInUserId } from "./signedInUserId.utils";

/**
 * Use this function to change signed in user id between an actual signed in user id and linked bot
 * ids. An actual firebase signed in user will remain unchanged. All listeners will change
 * firestore queries to listen to the changed user id. Backend API will receive the changed user id
 * and email as if the bot was actually signed in. If the new user does not belong to the open
 * workspace, it will be closed.
 * @throws {Error} When the user details document is not found. When The provided id to change the
 * signed in user id does not belong to the actual signed in user's linked ids.
 */
export default async function switchUserIdBetweenLinkedBotIds(userId: string): Promise<void> {
  const userDetailsDoc = await firstValueFrom(listenCurrentUserDetails());
  if (!userDetailsDoc) throw new Error("The user details document not found.");
  if (!userDetailsDoc.linkedUserDocumentIds.includes(userId))
    throw new Error(
      `The provided id ${userId} to change the signed in user id does not ` +
        `belong to the actual signed in user's linked ids.`
    );
  const openWorkspace = await firstValueFrom(listenOpenWorkspace());
  if (!openWorkspace || !openWorkspace.userIds.includes(userId)) setOpenWorkspaceId(null);
  _setSignedInUserId(userId);
}
