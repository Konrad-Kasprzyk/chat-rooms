import { getListenerSubject, listenerError, saveListener } from "client_api/utils/listeners.utils";
import auth from "common/db/auth.firebase";
import collections from "common/db/collections.firebase";
import User from "common/models/user.model";
import { FirestoreError, doc, onSnapshot } from "firebase/firestore";
import { BehaviorSubject, Observable } from "rxjs";

/**
 * This function reuses already created observable.
 * @throws {string} When the user is not signed in.
 */
export default function listenCurrentUser(): Observable<User | null> {
  if (!auth.currentUser) throw "User is not signed in.";
  const uid = auth.currentUser.uid;
  const existingUserSubject = getListenerSubject("currentUser", uid);
  if (existingUserSubject) return existingUserSubject.asObservable();
  const userSubject = new BehaviorSubject<User | null>(null);
  const unsubscribeUserListener = onSnapshot(
    doc(collections.users, uid),
    (userSnap) => {
      if (!userSnap.exists()) {
        userSubject.next(null);
        return;
      }
      const user = userSnap.data();
      userSubject.next(user);
    },
    (error: FirestoreError) => {
      listenerError("currentUser", uid, error);
    }
  );
  saveListener("currentUser", unsubscribeUserListener, userSubject, uid);
  return userSubject.asObservable();
}
