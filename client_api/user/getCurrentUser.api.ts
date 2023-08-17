import SubsSubjectPack from "client_api/utils/subsSubjectPack.class";
import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import User from "common/models/user.model";
import { doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";

/**
 * @throws {string} When the user is not signed in.
 */
export default function getCurrentUser(): BehaviorSubject<User | null> {
  if (!auth.currentUser) throw "User is not signed in.";
  const uid = auth.currentUser.uid;
  const currentUserSubjectOrNull = SubsSubjectPack.find("currentUser", {
    uid,
  })?.subject;
  if (currentUserSubjectOrNull) return currentUserSubjectOrNull;
  const currentUserSubject = new BehaviorSubject<User | null>(null);
  const unsubscribeUser = onSnapshot(
    doc(collections.users, uid),
    (userSnap) => {
      if (!userSnap.exists()) {
        currentUserSubject.next(null);
        return;
      }
      const user = userSnap.data();
      currentUserSubject.next(user);
    },
    (_error) => {
      currentUserSubject.error(_error.message);
      SubsSubjectPack.find("currentUser", {
        uid,
      })?.remove();
    }
  );
  SubsSubjectPack.saveAndAppendSubsSubjectPack(
    "currentUser",
    { uid },
    [unsubscribeUser],
    currentUserSubject
  );
  return currentUserSubject;
}
