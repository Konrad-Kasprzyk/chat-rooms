import CompletedTaskStats from "common/models/completedTaskStats.model";
import Goal from "common/models/goal.model";
import Norm from "common/models/norm.model";
import Task from "common/models/task.model";
import User from "common/models/user.model";
import Workspace from "common/models/workspace_models/workspace.model";
import { FirestoreError, Unsubscribe } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", removeAllListeners);
}

type validListeners = {
  currentUser: User | null;
  workspace: Workspace | null;
  tasks: Task[] | [];
  goals: Goal[] | [];
  norms: Norm[] | [];
  stats: CompletedTaskStats[] | [];
};

class ListenerPack<K extends keyof validListeners> {
  constructor(
    public modelName: K,
    public unsubscribe: Unsubscribe,
    public subject: BehaviorSubject<validListeners[K]>,
    public queryId: string
  ) {}
}

let listenerPacks: ListenerPack<any>[] = [];

export function getListenerSubject<K extends keyof validListeners>(
  modelName: K,
  queryId: string
): BehaviorSubject<validListeners[K]> | undefined {
  return listenerPacks.find((lp) => lp.modelName === modelName && lp.queryId === queryId)?.subject;
}

/**
 * Saves a listener and removes any existing listeners with the same name.
 * Saved listeners are removed on page close and refresh.
 */
export function saveListener<K extends keyof validListeners>(
  modelName: K,
  unsubscribe: Unsubscribe,
  subject: BehaviorSubject<validListeners[K]>,
  queryId: string
): void {
  const listenerPacksToRemove = listenerPacks.filter((lp) => lp.modelName === modelName);
  for (const lp of listenerPacksToRemove) {
    lp.unsubscribe();
    lp.subject.complete();
    const idx = listenerPacks.indexOf(lp);
    if (idx > -1) listenerPacks.splice(idx, 1);
  }
  listenerPacks.push(new ListenerPack(modelName, unsubscribe, subject, queryId));
}

/**
 * Calls error on listener subject and removes that listener
 */
export function listenerError<K extends keyof validListeners>(
  modelName: K,
  queryId: string,
  error: FirestoreError
): void {
  const listenerPackToRemove = listenerPacks.find(
    (lp) => lp.modelName === modelName && lp.queryId === queryId
  );
  if (listenerPackToRemove) {
    listenerPackToRemove.unsubscribe();
    listenerPackToRemove.subject.error(error.message);
    const idx = listenerPacks.indexOf(listenerPackToRemove);
    if (idx > -1) listenerPacks.splice(idx, 1);
  }
}

export function removeAllListeners() {
  for (const lp of listenerPacks) {
    lp.unsubscribe();
    lp.subject.complete();
  }
  listenerPacks = [];
}
