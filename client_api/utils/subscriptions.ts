import { Unsubscribe } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";
import MAX_REALTIME_CONNECTIONS from "../../global/constants/maxRealtimeConnections";
import {
  SubjectModels,
  SubsSubjectPackFilters,
  subsSubjectPackKeys,
} from "../../global/types/subscriptions";

// window.addEventListener("beforeunload", () => {
//   for (const unsubscribe of unsubscribes) {
//     unsubscribe();
//   }
// });

let totalFirestoreUnsubscriptionsCount = 0;
const subsSubjectPacks: SubsSubjectPack<any>[] = [];
/**
 * Holds firestore subscriptions with a linked rxjs subject.
 * The firestore subscriptions are emitting values trough the rxjs subject.
 */
class SubsSubjectPack<K extends (typeof subsSubjectPackKeys)[number]> {
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

export function removeSubsSubjectPack<K extends (typeof subsSubjectPackKeys)[number]>(
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

export function removeOnlyFirestoreSubscriptionsFromSubsSubjectPack<
  K extends (typeof subsSubjectPackKeys)[number]
>(subsSubjectPackKey: K, filters: SubsSubjectPackFilters[K]) {
  const subsSubjectPack = subsSubjectPacks.find(
    (subs) =>
      subs.subsSubjectPackKey === subsSubjectPackKey &&
      JSON.stringify(subs.filters) === JSON.stringify(filters)
  );
  if (!subsSubjectPack) return;
  for (const firestoreUnsub of subsSubjectPack.firestoreUnsubscriptions) {
    firestoreUnsub();
    totalFirestoreUnsubscriptionsCount--;
  }
  subsSubjectPack.firestoreUnsubscriptions = [];
  return subsSubjectPack.subject;
}

export function appendFirestoreUnsubscriptionsIntoSubsSubjectPack<
  K extends (typeof subsSubjectPackKeys)[number]
>(
  subsSubjectPackKey: K,
  filters: SubsSubjectPackFilters[K],
  firestoreUnsubscriptions: Unsubscribe[]
) {
  const subsSubjectPack = subsSubjectPacks.find(
    (subs) =>
      subs.subsSubjectPackKey === subsSubjectPackKey &&
      JSON.stringify(subs.filters) === JSON.stringify(filters)
  );
  if (!subsSubjectPack) return;
  totalFirestoreUnsubscriptionsCount += firestoreUnsubscriptions.length;
  subsSubjectPack.firestoreUnsubscriptions.push(...firestoreUnsubscriptions);
  if ("workspaceId" in filters)
    while (totalFirestoreUnsubscriptionsCount > MAX_REALTIME_CONNECTIONS)
      _removeOldestSubsSubjectPackFromDifferentWorkspace(filters.workspaceId);
  return subsSubjectPack.subject;
}

/**
 * Creates and saves new SubsSubjectPack. Current SubsSubjectPack with provided
 * filters is removed and replaced by the newly created one.
 * @param filters What filters were used to get the documents.
 */
export function saveAndReplaceSubsSubjectPack<K extends (typeof subsSubjectPackKeys)[number]>(
  subsSubjectPackKey: K,
  filters: SubsSubjectPackFilters[K],
  firestoreSubscriptions: Unsubscribe[],
  subject: BehaviorSubject<SubjectModels[K]>
) {
  const subsSubjectPack = subsSubjectPacks.find(
    (subs) =>
      subs.subsSubjectPackKey === subsSubjectPackKey &&
      JSON.stringify(subs.filters) === JSON.stringify(filters)
  );
  if (subsSubjectPack) {
    subsSubjectPack.subscriptionTime = new Date();
    subsSubjectPack.firestoreUnsubscriptions.push(...firestoreSubscriptions);
    subsSubjectPack.subject = subject;
  } else {
    subsSubjectPacks.push(
      new SubsSubjectPack<K>(
        subsSubjectPackKey,
        new Date(),
        filters,
        firestoreSubscriptions,
        subject
      )
    );
  }
  totalFirestoreUnsubscriptionsCount += firestoreSubscriptions.length;
  if ("workspaceId" in filters)
    while (totalFirestoreUnsubscriptionsCount > MAX_REALTIME_CONNECTIONS)
      _removeOldestSubsSubjectPackFromDifferentWorkspace(filters.workspaceId);
}

/**
 *
 * @param filters What filters were used to get the documents.
 * @returns BehaviorSubject with all documents from firestore subscriptions.
 */
export function getSubjectFromSubsSubjectPack<K extends (typeof subsSubjectPackKeys)[number]>(
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
