import createEmptyWorkspace from "client_api/workspace/createEmptyWorkspace.api";
import auth from "common/db/auth.firebase";
import { v4 as uuidv4 } from "uuid";
import { addUsersToWorkspace } from "./addUsersToWorkspace.util";

/**
 * Creates an empty workspace with an optional filename in the title and description.
 * Currently signed in user will be added to the workspace.
 * Can optionally provide other users to add to the workspace.
 */
export default async function createTestEmptyWorkspace(
  filename: string = "",
  belongingUsers?: string[]
): Promise<string> {
  if (!auth.currentUser) throw new Error("User is not signed in.");
  const workspaceUrl = uuidv4();
  const workspaceTitle = "Test title from file: " + filename;
  const workspaceDescription = "Test description from file: " + filename;
  const workspaceId = await createEmptyWorkspace(
    workspaceUrl,
    workspaceTitle,
    workspaceDescription
  );
  if (belongingUsers) await addUsersToWorkspace(workspaceId, belongingUsers);
  return workspaceId;
}
