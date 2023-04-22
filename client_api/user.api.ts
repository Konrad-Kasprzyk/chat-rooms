import User from "../global/models/user.model";
import { db } from "../db/firebase";
import { addToUnsubscribe, unsubscribeAndRemove } from "./utils/subscriptions2";
import { BehaviorSubject } from "rxjs";
import { Unsubscribe } from "firebase/firestore";
import { adminApp, adminDb } from "../db/firebase-admin";
import APP_URL from "../global/constants/url";

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

export function signInWithGoogle(): string {
  // if user model doesn't exist, create it
  return "user model id";
}

export function signInWithGitHub(): string {
  // if user model doesn't exist, create it
  return "user model id";
}

export function signInWithFacebook(): string {
  // if user model doesn't exist, create it
  return "user model id";
}

export function sendSignInLinkToEmail() {}

export function signInWithEmailLink() {
  // if user model doesn't exist, create it
}

// Create user model, it doesn't register a new user
function createUserModel(email: string, username: string): string {
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

export const exportedForTesting =
  process.env.NODE_ENV === "test"
    ? {
        createUserModel,
      }
    : {};
