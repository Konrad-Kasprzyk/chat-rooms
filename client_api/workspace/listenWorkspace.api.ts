import { getListenerSubject, listenerError, saveListener } from "client_api/utils/listeners.utils";
import collections from "common/db/collections.firebase";
import Workspace from "common/models/workspace_models/workspace.model";
import { FirestoreError, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";

export default function listenWorkspace(workspaceId: string): Observable<Workspace | null> {
  const existingWorkspaceSubject = getListenerSubject("workspace", workspaceId);
  if (existingWorkspaceSubject) return existingWorkspaceSubject.asObservable();
  const workspaceSubject = new BehaviorSubject<Workspace | null>(null);
  const unsubscribeWorkspaceListener = onSnapshot(
    doc(collections.workspaces, workspaceId),
    (workspaceSnap) => {
      if (!workspaceSnap.exists()) {
        workspaceSubject.next(null);
        return;
      }
      const workspace = workspaceSnap.data();
      workspaceSubject.next(workspace);
    },
    (error: FirestoreError) => {
      listenerError("workspace", workspaceId, error);
    }
  );
  saveListener("workspace", unsubscribeWorkspaceListener, workspaceSubject, workspaceId);
  return workspaceSubject.asObservable();
}
