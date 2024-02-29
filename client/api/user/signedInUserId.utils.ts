import auth from "client/db/auth.firebase";
import { Observable, Subject } from "rxjs";

let signedInUserId: string | null = auth.currentUser ? auth.currentUser.uid : null;
const signedInUserIdSubject = new Subject<string | null>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
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
