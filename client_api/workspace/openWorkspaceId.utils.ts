import { Observable, Subject } from "rxjs";

let openWorkspaceId: string | null = null;
const openWorkspaceIdSubject = new Subject<string | null>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    openWorkspaceIdSubject.complete();
  });
}

export function listenOpenWorkspaceIdChanges(): Observable<string | null> {
  return openWorkspaceIdSubject.asObservable();
}

export function getOpenWorkspaceId(): string | null {
  return openWorkspaceId;
}

/**
 * Use when opening new workspace.
 */
export function setOpenWorkspaceId(workspaceId: string | null): void {
  if (workspaceId !== openWorkspaceId) {
    openWorkspaceId = workspaceId;
    openWorkspaceIdSubject.next(workspaceId);
  }
}
