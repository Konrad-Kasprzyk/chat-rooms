import { collection, getDocs, query, where } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";
import { auth, db } from "../db/firebase";
import COLLECTIONS from "../global/constants/collections";
import Workspace from "../global/models/workspace.model";
import fetchPost from "../global/utils/fetchPost";
import { getCurrentUser } from "./user.api";

/**
 * @throws {string} When the user is not logged in, user document is not found
 * or the workspace with given url already exists.
 */
export async function createEmptyWorkspace(
  url: string,
  title: string,
  description: string
): Promise<string> {
  if (!auth.currentUser) throw "User is not logged in.";
  if (!getCurrentUser().value) throw "User document not found.";
  const sameUrlQuery = query(collection(db, COLLECTIONS.workspaces), where("url", "==", url));
  const sameUrlSnap = await getDocs(sameUrlQuery);
  if (!sameUrlSnap.empty) throw "Workspace with url " + url + " already exists.";
  const res = await fetchPost("api/create-empty-workspace", { url, title, description });
  if (res.status !== 201) throw await res.text();
  const workspaceId = res.text();
  return workspaceId;
}

export function createWorkspaceWithDemoData(
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
