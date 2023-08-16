import SubsSubjectPack from "client_api/utils/subsSubjectPack.class";
import Workspace from "common/models/workspace_models/workspace.model";
import collections from "db/client/collections.firebase";
import { FirestoreError, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";

export default function getWorkspace(workspaceId: string): BehaviorSubject<Workspace | null> {
  const workspaceSubjectOrNull = SubsSubjectPack.find("workspace", {
    workspaceId,
  })?.subject;
  if (workspaceSubjectOrNull) return workspaceSubjectOrNull;
  const workspaceSubject = new BehaviorSubject<Workspace | null>(null);
  const unsubscribeWorkspace = onSnapshot(
    doc(collections.workspaces, workspaceId),
    (workspaceSnap) => {
      if (!workspaceSnap.exists()) {
        workspaceSubject.next(null);
        return;
      }
      const workspace = workspaceSnap.data();
      workspaceSubject.next(workspace);
    },
    (_error: FirestoreError) => {
      workspaceSubject.error(_error.message);
      SubsSubjectPack.find("workspace", {
        workspaceId,
      })?.remove();
    }
  );
  SubsSubjectPack.saveAndAppendSubsSubjectPack(
    "workspace",
    { workspaceId },
    [unsubscribeWorkspace],
    workspaceSubject
  );
  return workspaceSubject;
}
