import User from "../global/models/user.model";
import { db } from "../db/firebase";
import { addToUnsubscribe, unsubscribeAndRemove } from "./utils/subscriptions";
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

const userSubject = new BehaviorSubject<User>(initialUser);
let unsubscribeUser: Unsubscribe | null = null;
export function getUser(id: string): BehaviorSubject<User> {
  return new BehaviorSubject(initialUser);
}
