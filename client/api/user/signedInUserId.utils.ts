import auth from "client/db/auth.firebase";
import USE_LOCAL_EMULATOR from "common/constants/useLocalEmulator.constant";
import { onAuthStateChanged } from "firebase/auth";
import { Observable, Subject } from "rxjs";

let signedInUserId: string | null = auth.currentUser ? auth.currentUser.uid : null;
const signedInUserIdSubject = new Subject<string | null>();
/**
 * Auth state listener is used for refreshing tabs and opening new tabs in browser.
 * Firebase emulator throws an error when using the onAuthStateChanged function.
 */
const unsubscribeAuthStateListener = !USE_LOCAL_EMULATOR
  ? onAuthStateChanged(auth, (user) => {
      if (!user) {
        signedInUserId = null;
        signedInUserIdSubject.next(null);
      } else {
        signedInUserId = user.uid;
        signedInUserIdSubject.next(user.uid);
      }
    })
  : null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (unsubscribeAuthStateListener) unsubscribeAuthStateListener();
    signedInUserIdSubject.complete();
  });
}

export function listenSignedInUserIdChanges(): Observable<string | null> {
  return signedInUserIdSubject.asObservable();
}

export function getSignedInUserId(): string | null {
  return signedInUserId;
}

/**
 * Use this function with firebase signing in/out methods.
 * When signing a user in, use the firebase auth methods first and then this function.
 * When signing a user out, use this function first and then the firebase auth methods.
 */
export function _setSignedInUserId(userId: string | null): void {
  if (userId !== signedInUserId) {
    signedInUserId = userId;
    signedInUserIdSubject.next(userId);
  }
}
