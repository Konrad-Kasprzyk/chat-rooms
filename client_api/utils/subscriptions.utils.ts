import MAX_REALTIME_CONNECTIONS from "common/constants/maxRealtimeConnections.constant";
import {
  SubjectModels,
  SubsSubjectPackFilters,
  subsSubjectPackKeys,
} from "common/types/subscriptions/subscriptions.types";
import { Unsubscribe } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";

// window.addEventListener("beforeunload", () => {
//   for (const unsubscribe of unsubscribes) {
//     unsubscribe();
//   }
// });

let totalFirestoreUnsubscriptionsCount = 0;
let subsSubjectPacks: SubsSubjectPack<any>[] = [];
/**
 * Holds firestore subscriptions with a linked rxjs subject.
 * The firestore subscriptions are emitting values trough the rxjs subject.
 */
class SubsSubjectPack<K extends subsSubjectPackKeys> {
  constructor(
    public subsSubjectPackKey: K,
    public subscriptionTime: Date,
    public filters: SubsSubjectPackFilters[K],
    public firestoreUnsubscriptions: Unsubscribe[],
    public subject: BehaviorSubject<SubjectModels[K]>
  ) {}
}

function _removeProvidedSubsSubjectPack(subsSubjectPackToRemove: SubsSubjectPack<any>) {
  subsSubjectPackToRemove.subject.complete();
  for (const firestoreUnsub of subsSubjectPackToRemove.firestoreUnsubscriptions) {
    firestoreUnsub();
    totalFirestoreUnsubscriptionsCount--;
  }
  const index = subsSubjectPacks.indexOf(subsSubjectPackToRemove);
  if (index > -1) subsSubjectPacks.splice(index, 1);
}

/**
 * When the total firestore subscriptions count is over established limit
 * it removes the oldest firestore subscriptions with the linked rxjs subject.
 */
function _removeOldestSubsSubjectPackFromDifferentWorkspace(currentWorkspaceId: string) {
  if (totalFirestoreUnsubscriptionsCount <= MAX_REALTIME_CONNECTIONS) return;
  let oldestSubscriptionTime = new Date();
  let subsSubjectPackToRemove: SubsSubjectPack<any> | null = null;
  for (const subs of subsSubjectPacks)
    if (
      subs.filters.workspaceId &&
      subs.filters.workspaceId !== currentWorkspaceId &&
      subs.subscriptionTime < oldestSubscriptionTime
    ) {
      oldestSubscriptionTime = subs.subscriptionTime;
      subsSubjectPackToRemove = subs;
    }
  if (!subsSubjectPackToRemove) return;
  _removeProvidedSubsSubjectPack(subsSubjectPackToRemove);
}

export function removeAllSubsSubjectPacks() {
  for (const subsSubjectPack of subsSubjectPacks) {
    subsSubjectPack.subject.complete();
    for (const firestoreUnsub of subsSubjectPack.firestoreUnsubscriptions) firestoreUnsub();
  }
  totalFirestoreUnsubscriptionsCount = 0;
  subsSubjectPacks = [];
}

export function removeSubsSubjectPack<K extends subsSubjectPackKeys>(
  subsSubjectPackKey: K,
  filters: SubsSubjectPackFilters[K]
) {
  const subsSubjectPackToRemove = subsSubjectPacks.find(
    (subs) =>
      subs.subsSubjectPackKey === subsSubjectPackKey &&
      JSON.stringify(subs.filters) === JSON.stringify(filters)
  );
  if (!subsSubjectPackToRemove) return;
  _removeProvidedSubsSubjectPack(subsSubjectPackToRemove);
}

/**
 * Creates and saves new SubsSubjectPack. If a SubsSubjectPack with the provided
 * filters exists, its RxJS subject is replaced with the provided one,
 * and the provided firestore unsubscriptions are appended to the existing ones.
 */
export function saveAndAppendSubsSubjectPack<K extends subsSubjectPackKeys>(
  subsSubjectPackKey: K,
  filters: SubsSubjectPackFilters[K],
  firestoreUnsubscriptions: Unsubscribe[],
  subject: BehaviorSubject<SubjectModels[K]>
) {
  const subsSubjectPack = subsSubjectPacks.find(
    (subs) =>
      subs.subsSubjectPackKey === subsSubjectPackKey &&
      JSON.stringify(subs.filters) === JSON.stringify(filters)
  );
  if (subsSubjectPack) {
    subsSubjectPack.subscriptionTime = new Date();
    subsSubjectPack.firestoreUnsubscriptions.push(...firestoreUnsubscriptions);
    subsSubjectPack.subject = subject;
  } else {
    subsSubjectPacks.push(
      new SubsSubjectPack<K>(
        subsSubjectPackKey,
        new Date(),
        filters,
        firestoreUnsubscriptions,
        subject
      )
    );
  }
  totalFirestoreUnsubscriptionsCount += firestoreUnsubscriptions.length;
  if ("workspaceId" in filters)
    while (totalFirestoreUnsubscriptionsCount > MAX_REALTIME_CONNECTIONS)
      _removeOldestSubsSubjectPackFromDifferentWorkspace(filters.workspaceId);
}

/**
 *
 * @param filters What filters were used to get the documents.
 * @returns BehaviorSubject with all documents from firestore subscriptions.
 */
export function getSubjectFromSubsSubjectPack<K extends subsSubjectPackKeys>(
  subsSubjectPackKey: K,
  filters: SubsSubjectPackFilters[K]
): BehaviorSubject<SubjectModels[K]> | null {
  const subsSubjectPack = subsSubjectPacks.find(
    (subs) =>
      subs.subsSubjectPackKey === subsSubjectPackKey &&
      JSON.stringify(subs.filters) === JSON.stringify(filters)
  );
  if (subsSubjectPack) return subsSubjectPack.subject;
  else return null;
}