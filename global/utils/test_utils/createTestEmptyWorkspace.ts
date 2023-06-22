import Workspace from "global/models/workspace.model";
import { v4 as uuidv4 } from "uuid";
import { createEmptyWorkspace } from "../admin_utils/workspace";
import { addUsersToWorkspace } from "../workspaceUsers";

export default async function createTestEmptyWorkspace(
  uid: string,
  filename: string = "",
  belongingUsers?: string[]
): Promise<Workspace> {
  const workspaceUrl = uuidv4();
  const workspaceTitle = "Test title from file: " + filename;
  const workspaceDescription = "Test description from file: " + filename;

  const createdWorkspace = await createEmptyWorkspace(
    uid,
    workspaceUrl,
    workspaceTitle,
    workspaceDescription
  );
  if (belongingUsers)
    await addUsersToWorkspace(
      belongingUsers,
      createdWorkspace.id,
      createdWorkspace.title,
      createdWorkspace.description
    );
  return createdWorkspace;
}
