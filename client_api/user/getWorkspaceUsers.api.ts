import SubsSubjectPack from "client_api/utils/subsSubjectPack.class";
import User from "common/models/user.model";
import collections from "db/client/collections.firebase";
import { onSnapshot } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";

export default function getWorkspaceUsers(workspaceId: string): BehaviorSubject<User[]> {
  const workspaceUsersSubjectOrNull = SubsSubjectPack.find("users", {
    workspaceId,
  })?.subject;
  if (workspaceUsersSubjectOrNull) return workspaceUsersSubjectOrNull;
  const workspaceUsersSubject = new BehaviorSubject<User[]>([]);
  const workspaceUsersQuery = collections.users.where(
    "workspaceIds",
    "array-contains",
    workspaceId
  );
  const unsubscribeWorkspaceUsers = onSnapshot(
    workspaceUsersQuery,
    (usersSnap) => {
      if (usersSnap.empty) {
        workspaceUsersSubject.next([]);
        return;
      }
      const users: User[] = [];
      for (const userSnap of usersSnap.docs) users.push(userSnap.data());
      workspaceUsersSubject.next(users);
    },
    (_error) => {
      workspaceUsersSubject.error(_error.message);
      SubsSubjectPack.find("users", {
        workspaceId,
      })?.remove();
    }
  );
  SubsSubjectPack.saveAndAppendSubsSubjectPack(
    "users",
    { workspaceId },
    [unsubscribeWorkspaceUsers],
    workspaceUsersSubject
  );
  return workspaceUsersSubject;
}
