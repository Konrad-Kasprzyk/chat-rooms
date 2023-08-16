import createEmptyWorkspace from "client_api/workspace/createEmptyWorkspace.api";
import auth from "db/client/auth.firebase";
import { v4 as uuidv4 } from "uuid";
import { addUsersToWorkspace } from "./addUsersToWorkspace.util";

export default async function createTestEmptyWorkspace(
  filename: string = "",
  belongingUsers?: string[]
): Promise<string> {
  if (!auth.currentUser) throw "User is not signed in.";
  const workspaceUrl = uuidv4();
  const workspaceTitle = "Test title from file: " + filename;
  const workspaceDescription = "Test description from file: " + filename;
  const workspaceId = await createEmptyWorkspace(
    workspaceUrl,
    workspaceTitle,
    workspaceDescription
  );
  if (belongingUsers) await addUsersToWorkspace(belongingUsers, workspaceId);
  return workspaceId;
}
