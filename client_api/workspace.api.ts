import { BehaviorSubject } from "rxjs";
import LABEL_COLORS from "../global/constants/colors";
import Workspace from "../global/models/workspace.model";

export function createEmptyWorkspace(
  url: string,
  title: string,
  description: string,
  testing: boolean = false
): string {
  return "workspace id";
}

export function createWorkspaceWithInitData(
  url: string,
  title: string,
  description: string,
  testing: boolean = false
): string {
  return "workspace id";
}

// Can remove only when one user is left
export function removeWorkspace(workspaceId: string): void {
  return null;
}

export function getWorkspace(workspaceId: string): BehaviorSubject<Workspace> {
  return null;
}

// Remember to change in user model
export function changeWorkspaceTitle(workspaceId: string, newTitle: string): void {
  return null;
}

// Remember to change in user model
export function changeWorkspaceDescription(workspaceId: string, newDescription: string): void {
  return null;
}

export function inviteUserToWorkspace(email: string, workspaceId: string): void {
  return null;
}

export function cancelUserInvitationToWorkspace(userId: string, workspaceId: string): void {
  return null;
}

export function removeUserFromWorkspace(userId: string, workspaceId: string): void {
  return null;
}

export function acceptWorkspaceInvitation(workspaceId: string): void {
  //   const auth = getAuth();
  // const user = auth.currentUser;
  return null;
}

export function rejectWorkspaceInvitation(workspaceId: string): void {
  //   const auth = getAuth();
  // const user = auth.currentUser;
  return null;
}
