import User from "../global/models/user.model";
import { db } from "../db/firebase";
import { addToUnsubscribe, unsubscribeAndRemove } from "./utils/subscriptions2";
import { BehaviorSubject } from "rxjs";
import { Unsubscribe } from "firebase/firestore";

const initialUser: User = {
  id: "",
  name: "",
  surname: "",
  nickname: "",
  nameAndSurnameVisible: false,
  nameAndSurnameVisibleInProjects: false,
  projectIds: [],
  projectInvitationIds: [],
  hidden: true,
  hiddenFromIds: [],
  visibleOnlyToIds: [],
};

export function createUser(email: string, password: string, username: string): string {
  return "user id";
}

export function deleteCurrentUser(): void {
  //   const auth = getAuth();
  // const user = auth.currentUser;
  return null;
}

// const userSubject = new BehaviorSubject<User>(initialUser);
// let unsubscribeUser: Unsubscribe | null = null;
export function getCurrentUser(): BehaviorSubject<User> {
  //   const auth = getAuth();
  // const user = auth.currentUser;
  return new BehaviorSubject(initialUser);
}

export function getWorkspaceUsers(workspaceId: string): BehaviorSubject<User[]> {
  return null;
}

export function changeCurrentUserUsername(newUsername: string): void {
  return null;
}
