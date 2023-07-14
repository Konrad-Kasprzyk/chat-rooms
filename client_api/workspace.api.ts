import fetchApi from "client_api/utils/fetchApi";
import API_URLS from "common/constants/apiUrls";
import COLLECTIONS from "common/constants/collections";
import Workspace from "common/models/workspace.model";
import { auth, db } from "db/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";
import { getCurrentUser } from "./user.api";
import {
  getSubjectFromSubsSubjectPack,
  removeSubsSubjectPack,
  saveAndReplaceSubsSubjectPack,
} from "./utils/subscriptions";

/**
 * @throws {string} When the user is not signed in, user document is not found
 * or the workspace with given url already exists.
 */
export async function createEmptyWorkspace(
  url: string,
  title: string,
  description: string
): Promise<string> {
  if (!auth.currentUser) throw "User is not signed in.";
  if (!getCurrentUser().value) throw "User document not found.";
  const sameUrlSnap = await getDoc(doc(db, COLLECTIONS.workspaceUrls, url));
  if (sameUrlSnap.exists()) throw "Workspace with url " + url + " already exists.";
  const res = await fetchApi(API_URLS.workspace.createEmptyWorkspace, { url, title, description });
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
  // Use backend api delete-workspace
  return null;
}

export function getWorkspace(workspaceId: string): BehaviorSubject<Workspace | null> {
  const workspaceSubjectOrNull = getSubjectFromSubsSubjectPack<"workspace">("workspace", {
    workspaceId,
  });
  if (workspaceSubjectOrNull) return workspaceSubjectOrNull;
  const workspaceSubject = new BehaviorSubject<Workspace | null>(null);
  const unsubscribeWorkspace = onSnapshot(
    doc(db, COLLECTIONS.workspaces, workspaceId),
    (workspaceSnap) => {
      if (!workspaceSnap.exists()) {
        workspaceSubject.next(null);
        return;
      }
      const workspace = workspaceSnap.data() as Workspace;
      workspaceSubject.next(workspace);
    },
    (_error) => {
      workspaceSubject.error(_error.message);
      removeSubsSubjectPack<"workspace">("workspace", {
        workspaceId,
      });
    }
  );
  saveAndReplaceSubsSubjectPack<"workspace">(
    "workspace",
    { workspaceId },
    [unsubscribeWorkspace],
    workspaceSubject
  );
  return workspaceSubject;
}

export async function changeWorkspaceTitle(workspaceId: string, newTitle: string) {
  const res = await fetchApi(API_URLS.workspace.changeWorkspaceTitle, { workspaceId, newTitle });
  if (!res.ok) throw await res.text();
}

export async function changeWorkspaceDescription(workspaceId: string, newDescription: string) {
  const res = await fetchApi(API_URLS.workspace.changeWorkspaceDescription, {
    workspaceId,
    newDescription,
  });
  if (!res.ok) throw await res.text();
}

export async function inviteUserToWorkspace(workspaceId: string, userEmailToInvite: string) {
  const res = await fetchApi(API_URLS.workspace.inviteUserToWorkspace, {
    workspaceId,
    userEmailToInvite,
  });
  if (!res.ok) throw await res.text();
}

export async function cancelUserInvitationToWorkspace(workspaceId: string, userId: string) {
  const res = await fetchApi(API_URLS.workspace.cancelUserInvitationToWorkspace, {
    workspaceId,
    userId,
  });
  if (!res.ok) throw await res.text();
}

export async function removeUserFromWorkspace(workspaceId: string, userId: string) {
  const res = await fetchApi(API_URLS.workspace.removeUserFromWorkspace, {
    workspaceId,
    userId,
  });
  if (!res.ok) throw await res.text();
}

export async function leaveWorkspace(workspaceId: string) {
  const res = await fetchApi(API_URLS.workspace.removeUserFromWorkspace, {
    workspaceId,
  });
  if (!res.ok) throw await res.text();
}

export async function acceptWorkspaceInvitation(workspaceId: string) {
  const res = await fetchApi(API_URLS.workspace.acceptWorkspaceInvitation, {
    workspaceId,
  });
  if (!res.ok) throw await res.text();
}

export async function rejectWorkspaceInvitation(workspaceId: string) {
  const res = await fetchApi(API_URLS.workspace.rejectWorkspaceInvitation, {
    workspaceId,
  });
  if (!res.ok) throw await res.text();
}
